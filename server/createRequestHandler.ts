import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import type {
  CloudFrontHeaders,
  CloudFrontRequestEvent,
  CloudFrontRequestHandler,
  CloudFrontResultResponse,
} from 'aws-lambda';
import { createRequestHandler as createRouterHandler, type ServerBuild } from 'react-router';
import { site } from '../app/site.ts';

/** The one host the site is indexed on; everything else is an alias of it. */
const CANONICAL_HOST = new URL(site.url).host;

/**
 * How long CloudFront may serve a rendered page without asking again, and how
 * long after that it may keep serving the old copy while it fetches a new one.
 *
 * Content only changes when the site is deployed, and a deploy invalidates the
 * whole distribution — so these are a safety net, not the freshness mechanism.
 * The stale window is what keeps the site feeling static: once a page has been
 * rendered, a reader practically never waits for a render again.
 */
const EDGE_MAX_AGE = 3600;
const EDGE_STALE_WHILE_REVALIDATE = 86_400;

/** Missing pages are cached too, briefly, so a crawler cannot hammer the renderer. */
const NOT_FOUND_MAX_AGE = 300;

const NO_STORE = 'private, no-store, max-age=0';

/**
 * A response generated at the edge may be 1 MB at most, counting the headers
 * and counting the body as it is returned — base64, a third larger than the
 * bytes it carries. The limit below leaves room for the headers.
 */
const MAX_ENCODED_BODY_BYTES = 1_000_000;

/** Below this, compressing costs more CPU than the bytes it saves. */
const MIN_COMPRESSIBLE_BYTES = 1024;

const COMPRESSIBLE =
  /^(?:text\/|application\/(?:json|xml|javascript|manifest\+json)|image\/svg\+xml)/v;

/** Headers CloudFront sets itself and rejects in a generated response. */
const FORBIDDEN_RESPONSE_HEADERS = new Set([
  'connection',
  'content-length',
  'expect',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'proxy-connection',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
  'x-forwarded-proto',
  'x-real-ip',
]);

export interface RequestHandlerConfig {
  build: ServerBuild;
  mode?: string;
}

/**
 * Decides whether a response may be stored in the shared cache.
 *
 * Default-deny: a response is public only if it is a GET or HEAD that set no
 * cookie and ended in a status worth remembering. Everything else — a form
 * submission most of all — is marked `no-store`. A route that knows better
 * sets its own `Cache-Control`, and that is left alone.
 *
 * The browser is always told `max-age=0`. Only CloudFront holds on to pages,
 * so a deploy that invalidates the edge is visible to every reader at once
 * rather than whenever their own copy happens to expire.
 */
const applyCacheControl = (request: Request, response: Response): void => {
  if (response.headers.has('Cache-Control')) return;

  const readOnly = request.method === 'GET' || request.method === 'HEAD';
  const shareable = readOnly && !response.headers.has('Set-Cookie');

  if (shareable && response.status === 200) {
    response.headers.set(
      'Cache-Control',
      `public, max-age=0, s-maxage=${EDGE_MAX_AGE}, stale-while-revalidate=${EDGE_STALE_WHILE_REVALIDATE}`,
    );
  } else if (shareable && response.status === 404) {
    response.headers.set('Cache-Control', `public, max-age=0, s-maxage=${NOT_FOUND_MAX_AGE}`);
  } else {
    response.headers.set('Cache-Control', NO_STORE);
  }
};

const toRequest = (event: CloudFrontRequestEvent): Request => {
  const record = event.Records[0];
  if (!record) throw new Error('CloudFront event carried no records');

  const { uri, method, headers, querystring, body } = record.cf.request;

  const requestHeaders = new Headers();
  for (const [name, values] of Object.entries(headers)) {
    for (const { value } of values) requestHeaders.append(name, value);
  }

  const host = requestHeaders.get('host') ?? CANONICAL_HOST;
  const url = new URL(`${uri}${querystring ? `?${querystring}` : ''}`, `https://${host}`);

  const hasBody = method !== 'GET' && method !== 'HEAD' && body?.data;

  return new Request(url, {
    method,
    headers: requestHeaders,
    body: hasBody
      ? Buffer.from(body.data, body.encoding === 'base64' ? 'base64' : 'utf8')
      : undefined,
  });
};

/**
 * Compresses a body with the best encoding the viewer accepts.
 *
 * CloudFront normalises `Accept-Encoding` and makes it part of the cache key,
 * so each variant is cached separately and a viewer never receives an encoding
 * it did not ask for. Compressing here, rather than leaving it to CloudFront,
 * is also what keeps a long article well inside the 1 MB response limit.
 */
const compress = (
  body: Buffer,
  request: Request,
  response: Response,
): { body: Buffer; encoding?: 'br' | 'gzip' } => {
  const type = response.headers.get('Content-Type') ?? '';
  if (
    body.length < MIN_COMPRESSIBLE_BYTES ||
    !COMPRESSIBLE.test(type) ||
    response.headers.has('Content-Encoding')
  ) {
    return { body };
  }

  const accepted = request.headers.get('accept-encoding') ?? '';

  if (/\bbr\b/v.test(accepted)) {
    return {
      encoding: 'br',
      body: brotliCompressSync(body, {
        params: {
          // A middle setting: nearly the ratio of the maximum at a fraction of the time.
          [constants.BROTLI_PARAM_QUALITY]: 5,
          [constants.BROTLI_PARAM_SIZE_HINT]: body.length,
        },
      }),
    };
  }

  if (/\bgzip\b/v.test(accepted)) return { encoding: 'gzip', body: gzipSync(body) };

  return { body };
};

const toCloudFrontHeaders = (headers: Headers): CloudFrontHeaders => {
  const result: CloudFrontHeaders = {};

  for (const [key, value] of headers) {
    if (FORBIDDEN_RESPONSE_HEADERS.has(key.toLowerCase())) continue;
    (result[key.toLowerCase()] ??= []).push({ key, value });
  }

  return result;
};

/**
 * Adapts a React Router server build to a CloudFront origin-request handler.
 *
 * The function answers every request itself and never lets one through to the
 * origin behind it, so that origin is only ever reached by the static-file
 * behaviours configured alongside.
 */
export const createRequestHandler = ({
  build,
  mode = 'production',
}: RequestHandlerConfig): CloudFrontRequestHandler => {
  const handleRequest = createRouterHandler(build, mode);

  return async (event): Promise<CloudFrontResultResponse> => {
    const request = toRequest(event);
    const response = await handleRequest(request);

    /*
     * The distribution also answers on its own `*.cloudfront.net` name, with
     * the identical site. Canonical tags say which host is real, but they are
     * a hint; this header is a directive, and it also covers the sitemap and
     * `robots.txt`, which have no markup to put a tag in.
     */
    if (new URL(request.url).host !== CANONICAL_HOST) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    applyCacheControl(request, response);

    const raw = Buffer.from(await response.arrayBuffer());
    const { body, encoding } = compress(raw, request, response);
    if (encoding) {
      response.headers.set('Content-Encoding', encoding);
      response.headers.append('Vary', 'Accept-Encoding');
    }

    const encoded = body.toString('base64');
    if (encoded.length > MAX_ENCODED_BODY_BYTES) {
      // CloudFront will answer 502. Say why, where the logs can be searched.
      console.error(
        `[edge] ${request.url} is ${encoded.length} bytes encoded; the limit is ${MAX_ENCODED_BODY_BYTES}`,
      );
    }

    return {
      status: String(response.status),
      headers: toCloudFrontHeaders(response.headers),
      // Always base64: it is the only encoding that carries compressed bytes,
      // and using one path for everything leaves no text/binary case to get wrong.
      bodyEncoding: 'base64',
      body: encoded,
    };
  };
};

import { PassThrough } from 'node:stream';
import { text } from 'node:stream/consumers';
import { createDOMRenderer, RendererProvider, renderToStyleElements } from '@griffel/react';
import { compareCSSQueries } from '@griffel/sort-css-queries';
import { renderToPipeableStream, renderToStaticMarkup } from 'react-dom/server';
import type { EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';

/** Give up on a render that has not finished by now, and send what there is. */
export const streamTimeout = 5_000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
): Promise<Response> {
  if (request.method.toUpperCase() === 'HEAD') {
    return new Response(null, { status: responseStatusCode, headers: responseHeaders });
  }

  /*
   * One renderer per request, collecting the style rules this page uses.
   *
   * `compareCSSQueries` orders media queries by width rather than as text.
   * Griffel's default compares the strings, which puts `(max-width: 1280px)`
   * before `(max-width: 600px)` only by the accident of "1" sorting before
   * "6" — atomic classes have equal specificity, so the later rule wins and
   * the order of the queries *is* the cascade.
   */
  const renderer = createDOMRenderer(undefined, { compareMediaQueries: compareCSSQueries });
  let statusCode = responseStatusCode;

  /*
   * The whole document is rendered before anything is sent, rather than
   * streamed. Two reasons: the styles go into `<head>`, and which rules exist
   * is only known once every component has rendered; and the production host
   * is Lambda@Edge, which returns a complete body and cannot stream anyway.
   * Pages are cached at the edge, so the wait is paid once per deploy.
   */
  const rendered = Promise.withResolvers<string>();

  const { pipe, abort } = renderToPipeableStream(
    <RendererProvider renderer={renderer}>
      <ServerRouter context={routerContext} url={request.url} />
    </RendererProvider>,
    {
      onAllReady() {
        clearTimeout(timeout);

        const body = new PassThrough();
        void text(body).then(rendered.resolve).catch(rendered.reject);
        pipe(body);
      },
      onShellError: rendered.reject,
      onError(error: unknown) {
        statusCode = 500;
        console.error(error);
      },
    },
  );
  const timeout = setTimeout(abort, streamTimeout);

  const html = await rendered.promise;

  const styles = renderToStaticMarkup(<>{renderToStyleElements(renderer)}</>);

  responseHeaders.set('Content-Type', 'text/html; charset=utf-8');

  return new Response(html.replace('</head>', `${styles}</head>`), {
    status: statusCode,
    headers: responseHeaders,
  });
}

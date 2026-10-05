/**
 * Source of the CloudFront Function that runs on every page request, before
 * the cache is consulted.
 *
 * It settles on one URL per page, so that the cache holds one copy of each and
 * search engines see one address:
 *
 * - **Host.** Once the domain is attached, every other name the distribution
 *   answers on (`www.`, its own `*.cloudfront.net`) redirects to the canonical
 *   one. Before that there is nothing to redirect to, so hosts are left alone.
 * - **Trailing slash.** `/about` redirects to `/about/`. That is the form the
 *   previous site published and the form every indexed link uses.
 *
 * Paths with a file extension are left alone — `/sitemap.xml`, and React
 * Router's own `/about/_.data` requests — and so is anything that is not a GET
 * or HEAD, because a redirect would turn a form submission into a GET.
 *
 * Written in the conservative subset of JavaScript the CloudFront Functions
 * runtime accepts, and generated rather than kept in a `.js` file because the
 * canonical host has to be baked in: these functions have no configuration.
 */
export const viewerRequestSource = (canonicalHost: string | undefined): string => `
var CANONICAL_HOST = ${JSON.stringify(canonicalHost ?? '')};

function handler(event) {
  var request = event.request;
  if (request.method !== 'GET' && request.method !== 'HEAD') return request;

  var host = request.headers.host ? request.headers.host.value : '';
  var uri = request.uri;

  var wrongHost = CANONICAL_HOST !== '' && host !== CANONICAL_HOST;
  var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
  var missingSlash = lastSegment !== '' && lastSegment.indexOf('.') === -1;

  if (!wrongHost && !missingSlash) return request;

  var pairs = [];
  Object.keys(request.querystring).forEach(function (key) {
    var entry = request.querystring[key];
    (entry.multiValue || [entry]).forEach(function (item) {
      pairs.push(item.value === '' ? key : key + '=' + item.value);
    });
  });

  return {
    statusCode: 301,
    statusDescription: 'Moved Permanently',
    headers: {
      location: {
        value:
          'https://' +
          (wrongHost ? CANONICAL_HOST : host) +
          uri +
          (missingSlash ? '/' : '') +
          (pairs.length ? '?' + pairs.join('&') : '')
      },
      'cache-control': { value: 'public, max-age=3600' }
    }
  };
}
`;

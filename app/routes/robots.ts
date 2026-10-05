import { absoluteUrl } from '~/site';

export const loader = () =>
  new Response(
    ['User-agent: *', 'Allow: /', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n'),
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );

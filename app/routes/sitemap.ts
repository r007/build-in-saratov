import { allPosts, listTags } from '~/content/posts.server';
import { absoluteUrl, site } from '~/site';

const escapeXml = (value: string): string =>
  value
    // Ampersands first, or the entities written below would be escaped again.
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

/** Every indexable URL, generated from the same content the pages render. */
export const loader = async () => {
  const [posts, tags] = await Promise.all([allPosts(), listTags()]);
  const newest = posts[0]?.date;

  const entries: Array<{ path: string; modified?: string }> = [
    ...site.navigation.map((item) => ({ path: item.to, modified: newest })),
    ...posts.map((post) => ({ path: `/${post.slug}/`, modified: post.date })),
    ...tags.map((tag) => ({ path: `/tags/${tag.slug}/`, modified: newest })),
  ];

  const urls = entries
    .map(
      ({ path, modified }) =>
        `<url><loc>${escapeXml(absoluteUrl(path))}</loc>${
          modified ? `<lastmod>${modified}</lastmod>` : ''
        }</url>`,
    )
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};

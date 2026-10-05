import type { MetaDescriptor } from 'react-router';
import { absoluteUrl, site } from './site';

export interface PageMeta {
  title: string;
  description?: string;
  /** Canonical path on this site, e.g. `/about/`. */
  path: string;
  /** Site-relative URL of a social preview image. */
  image?: string;
  type?: 'website' | 'article';
  /** Set to `false` for pages that should stay out of search results. */
  index?: boolean;
}

/**
 * The `<head>` metadata for a page, in one consistent shape.
 *
 * Every page gets a canonical URL on the one real origin. The site is also
 * reachable on its CloudFront name and with or without `www`, and this tag is
 * what tells a crawler those are all the same page.
 */
export const pageMeta = ({
  title,
  description = site.tagline,
  path,
  image,
  type = 'website',
  index = true,
}: PageMeta): MetaDescriptor[] => {
  const fullTitle = `${title} | ${site.name}`;
  const imageUrl = image === undefined ? undefined : absoluteUrl(image);

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { tagName: 'link', rel: 'canonical', href: absoluteUrl(path) },
    ...(index ? [] : [{ name: 'robots', content: 'noindex, follow' }]),
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: absoluteUrl(path) },
    { property: 'og:site_name', content: site.name },
    { property: 'og:locale', content: 'ru_RU' },
    ...(imageUrl === undefined ? [] : [{ property: 'og:image', content: imageUrl }]),
    { name: 'twitter:card', content: imageUrl === undefined ? 'summary' : 'summary_large_image' },
    { name: 'twitter:creator', content: `@${site.twitter}` },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    ...(imageUrl === undefined ? [] : [{ name: 'twitter:image', content: imageUrl }]),
  ];
};

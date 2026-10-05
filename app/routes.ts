import { index, route, type RouteConfig } from '@react-router/dev/routes';

/*
 * Every URL the site answers, in one place.
 *
 * Posts live at the root (`/some-post/`) because that is where they have
 * always been and where search engines and old links expect them. The `:slug`
 * route therefore has to come after every fixed path, or it would swallow them.
 */
export default [
  index('routes/home.tsx'),
  route('articles', 'routes/articles.tsx'),
  route('about', 'routes/about.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('search', 'routes/search.tsx'),
  route('tags/:tag', 'routes/tag.tsx'),
  route('robots.txt', 'routes/robots.ts'),
  route('sitemap.xml', 'routes/sitemap.ts'),
  route(':slug', 'routes/post.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;

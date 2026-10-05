/** The compiled `content/` directory. See `plugins/content`. Server-only. */
declare module 'virtual:content' {
  import type { Content } from '~/content/types';

  export const posts: Content['posts'];
  export const authors: Content['authors'];
  export const tags: Content['tags'];
  export const images: Content['images'];
}

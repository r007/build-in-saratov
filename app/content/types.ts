/**
 * The shape of compiled content.
 *
 * Shared by the build-time compiler in `plugins/content` and the loaders that
 * read it, so the two cannot drift apart. Nothing here knows where content
 * comes from: today it is Markdown compiled into the server bundle, later it
 * may be a database behind the same types.
 */

/** A raster image with its responsive variants, ready for an `<img>`. */
export interface Picture {
  /** The variant closest to the display width; the `src` fallback. */
  src: string;
  /** Every generated width, as a `srcset` value. Empty for GIF and SVG. */
  srcSet: string;
  /** Display size in CSS pixels, so the browser reserves the space. */
  width: number;
  height: number;
  /** Dominant colour, painted behind the image while it loads. */
  color: string;
}

/** A picture that is also used as a social preview. */
export interface Cover extends Picture {
  /** A JPEG at Open Graph size; crawlers do not reliably read WebP. */
  social: string;
}

export interface Author {
  name: string;
  bio: string;
  avatar?: Picture;
}

export interface Tag {
  name: string;
  /** URL segment, e.g. `хостинги` for `Хостинги`. */
  slug: string;
  description?: string;
}

export interface Post {
  slug: string;
  title: string;
  /** ISO 8601. */
  date: string;
  /** The date as a reader sees it, formatted at build time. */
  dateLabel: string;
  tags: Tag[];
  author: string;
  cover?: Cover;
  /** The first ~140 characters of prose, for cards and descriptions. */
  excerpt: string;
  /** Rendered, highlighted HTML of the body. */
  html: string;
  /** The body as plain text, for the search index. Never sent to a browser. */
  text: string;
}

export interface Content {
  posts: Post[];
  authors: Author[];
  tags: Tag[];
  /** Images from `content/img`, keyed by file name. */
  images: Record<string, Cover>;
}

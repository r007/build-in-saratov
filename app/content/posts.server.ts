import { authors, images, posts, tags } from 'virtual:content';
import type { Author, Cover, Post, Tag } from './types';

/**
 * The content repository.
 *
 * Routes ask for content here and nowhere else. Everything is `async` although
 * today's implementation is an in-memory lookup: that keeps the calling code
 * unchanged on the day posts or comments move into a database, where the same
 * questions become network calls.
 */

/** What a list of posts needs — no body, so teasers stay cheap to send. */
export type PostSummary = Pick<Post, 'slug' | 'title' | 'excerpt' | 'cover' | 'tags' | 'dateLabel'>;

/** A post as a reader sees it; `text` exists only for the search index. */
export type PostDetail = Omit<Post, 'text'>;

export interface PostPage {
  post: PostDetail;
  author?: Author;
  /** The posts published immediately before and after this one. */
  older?: PostSummary;
  newer?: PostSummary;
  /** Other posts sharing this post's first tag. */
  related?: { tag: Tag; posts: PostSummary[]; total: number };
}

const RELATED_LIMIT = 3;

const summarise = ({
  slug,
  title,
  excerpt,
  cover,
  tags: postTags,
  dateLabel,
}: Post): PostSummary => ({
  slug,
  title,
  excerpt,
  cover,
  tags: postTags,
  dateLabel,
});

/** Posts, newest first, optionally restricted to a tag slug. */
export const listPosts = async (
  options: { tag?: string; limit?: number } = {},
): Promise<PostSummary[]> => {
  const { tag, limit } = options;
  const matching =
    tag === undefined ? posts : posts.filter((post) => post.tags.some((t) => t.slug === tag));

  return await Promise.resolve(matching.slice(0, limit).map(summarise));
};

export const getPostPage = async (slug: string): Promise<PostPage | undefined> => {
  const index = posts.findIndex((candidate) => candidate.slug === slug);
  const found = posts[index];
  if (!found) {
    await Promise.resolve(undefined);
    return;
  }

  const { text: _text, ...post } = found;
  const [tag] = found.tags;
  const sameTag = tag ? posts.filter((other) => other.tags.some((t) => t.slug === tag.slug)) : [];

  // `posts` is newest first, so the next index is the older neighbour.
  const older = posts[index + 1];
  const newer = posts[index - 1];

  return await Promise.resolve({
    post,
    author: authors.find((author) => author.name === found.author),
    older: older && summarise(older),
    newer: newer && summarise(newer),
    related: tag && {
      tag,
      posts: sameTag
        .filter((other) => other.slug !== slug)
        .slice(0, RELATED_LIMIT)
        .map(summarise),
      total: sameTag.length,
    },
  });
};

export const listTags = async (): Promise<Tag[]> => await Promise.resolve(tags);

export const getTag = async (slug: string): Promise<Tag | undefined> =>
  await Promise.resolve(tags.find((tag) => tag.slug === slug));

/** An image from `content/img`, by file name. */
export const getImage = async (name: string): Promise<Cover | undefined> =>
  await Promise.resolve(images[name]);

/** Every post in full, for the search index and the sitemap. */
export const allPosts = async (): Promise<readonly Post[]> => await Promise.resolve(posts);

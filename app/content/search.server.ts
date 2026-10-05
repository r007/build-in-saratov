import MiniSearch from 'minisearch';
import type { TextRun } from '~/components/ResultList';
import { allPosts } from './posts.server';
import type { Post } from './types';

export interface SearchResult {
  slug: string;
  title: string;
  excerpt: TextRun[];
}

/** Characters of context shown around the first match. */
const EXCERPT_RADIUS = 90;
const MAX_QUERY_LENGTH = 100;
const MAX_RESULTS = 20;

/**
 * Folds case, and `ё` into `е`.
 *
 * Russian text is written with either letter for the same word, so a reader
 * who types «елка» must find a post that says «ёлка» and the other way round.
 */
const normalise = (value: string): string => value.toLocaleLowerCase('ru').replaceAll('ё', 'е');

const escapeRegExp = (value: string): string => value.replace(/[.*+?^$\{\}\(\)\|\[\]\\]/gv, '\\$&');

let index: Promise<MiniSearch<Post>> | undefined = undefined;

/**
 * Built once per server instance, on the first search.
 *
 * Seventeen posts index in a few milliseconds, which is why this is a library
 * in the server bundle rather than a hosted search service: no third party, no
 * API key, and nothing extra for the browser to download.
 */
const getIndex = async (): Promise<MiniSearch<Post>> => {
  index ??= allPosts().then((posts) => {
    const search = new MiniSearch<Post>({
      idField: 'slug',
      fields: ['title', 'tags', 'text'],
      storeFields: ['title'],
      extractField: (post, field) => {
        if (field === 'tags') return post.tags.map((tag) => tag.name).join(' ');
        if (field === 'title') return post.title;
        return field === 'slug' ? post.slug : post.text;
      },
      processTerm: (term) => normalise(term) || null,
      searchOptions: {
        boost: { title: 3, tags: 2 },
        // Matching on prefixes is a serviceable stand-in for stemming in an
        // inflected language: «хостинг» finds «хостинги» and «хостингом».
        prefix: true,
        fuzzy: 0.15,
        combineWith: 'AND',
      },
    });
    search.addAll(posts);
    return search;
  });

  return await index;
};

/**
 * Cuts an excerpt around the first matched term and marks every match in it.
 *
 * Returned as runs of text rather than HTML, so rendering it never involves
 * injecting markup built from a query string.
 */
const excerptAround = (text: string, terms: string[], fallback: string): TextRun[] => {
  if (terms.length === 0) return [{ text: fallback, match: false }];

  const pattern = new RegExp(
    terms
      .sort((a, b) => b.length - a.length)
      .map((term) => escapeRegExp(term).replaceAll('е', '[её]'))
      .join('|'),
    'giv',
  );

  const first = pattern.exec(text);
  if (!first) return [{ text: fallback, match: false }];

  const start = Math.max(0, text.lastIndexOf(' ', Math.max(0, first.index - EXCERPT_RADIUS)));
  const nextSpace = text.indexOf(' ', first.index + EXCERPT_RADIUS);
  const end = nextSpace === -1 ? text.length : nextSpace;
  const window = `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;

  // `exec` above left the pattern pointing past its match in the full text;
  // rewind it, or the scan of the excerpt would start beyond the excerpt's end.
  pattern.lastIndex = 0;

  const runs: TextRun[] = [];
  let cursor = 0;
  for (const match of window.matchAll(pattern)) {
    if (match.index > cursor) runs.push({ text: window.slice(cursor, match.index), match: false });
    runs.push({ text: match[0], match: true });
    cursor = match.index + match[0].length;
  }
  if (cursor < window.length) runs.push({ text: window.slice(cursor), match: false });

  return runs;
};

export const searchPosts = async (rawQuery: string): Promise<SearchResult[]> => {
  const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH);
  if (query === '') return [];

  const [search, posts] = await Promise.all([getIndex(), allPosts()]);
  const bySlug = new Map(posts.map((post) => [post.slug, post]));

  return search
    .search(query)
    .slice(0, MAX_RESULTS)
    .flatMap((hit) => {
      const post = bySlug.get(String(hit.id));
      if (!post) return [];

      return [
        {
          slug: post.slug,
          title: post.title,
          excerpt: excerptAround(post.text, hit.terms, post.excerpt),
        },
      ];
    });
};

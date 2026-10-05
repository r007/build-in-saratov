import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { Author, Content, Cover, Post, Tag } from '../../app/content/types.ts';
import { createImagePipeline } from './images.ts';
import { createMarkdownCompiler, type MarkdownOptions } from './markdown.ts';

export interface CompileOptions {
  /** Directory holding `posts/`, `img/`, `authors.yaml` and `tags.yaml`. */
  contentDir: string;
  /** Where generated images are written; must be served at `publicPath`. */
  mediaDir: string;
  publicPath: string;
  /** BCP 47 locale used for dates and tag slugs. */
  locale: string;
  /** Posts marked `draft: true` are compiled only when this is set. */
  includeDrafts: boolean;
  /** Layout widths, in CSS pixels, that images are sized for. */
  coverWidth: number;
  avatarWidth: number;
  markdown: MarkdownOptions;
}

const RASTER = new Set(['.png', '.jpg', '.jpeg', '.webp']);

/** `Хостинги` -> `хостинги`, `Web Design` -> `web-design`. */
const slugify = (value: string, locale: string): string =>
  value
    .toLocaleLowerCase(locale)
    .replace(/[^\p{L}\p{N}]+/gv, '-')
    .replace(/^-|-$/gv, '');

/** Parses a YAML file, or returns `undefined` when there is none. */
const readYaml = async (file: string): Promise<unknown> =>
  existsSync(file) ? (parseYaml(await readFile(file, 'utf8')) as unknown) : undefined;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const optionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

/**
 * Formats a date without the trailing ` г.` that `ru-RU` appends to a year.
 *
 * Built from parts rather than by trimming the formatted string, so it keeps
 * working for a locale whose pattern is shaped differently.
 */
const createDateLabel = (locale: string): ((date: Date) => string) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (date) => {
    const parts = formatter.formatToParts(date);
    const pick = (type: Intl.DateTimeFormatPartTypes): string =>
      parts.find((part) => part.type === type)?.value ?? '';

    return `${pick('day')} ${pick('month')} ${pick('year')}`;
  };
};

/**
 * Compiles everything under `contentDir` into plain data.
 *
 * Markdown becomes highlighted HTML, images become hashed responsive files,
 * and the result is a single serialisable object. All of the expensive work
 * happens here, at build time, so that rendering a page on the server is a
 * lookup and a string concatenation.
 */
export const compileContent = async (options: CompileOptions): Promise<Content> => {
  const { contentDir, locale } = options;
  const images = createImagePipeline(options.mediaDir, options.publicPath);
  const compileMarkdown = createMarkdownCompiler(images, options.markdown);
  const dateLabel = createDateLabel(locale);

  const tagsFile = await readYaml(join(contentDir, 'tags.yaml'));
  const tagDescriptions = isRecord(tagsFile) ? tagsFile : {};
  const toTag = (name: string): Tag => ({
    name,
    slug: slugify(name, locale),
    description: optionalString(tagDescriptions[name]),
  });

  const authorsFile = await readYaml(join(contentDir, 'authors.yaml'));
  const authors = await Promise.all(
    (Array.isArray(authorsFile) ? authorsFile : [])
      .filter(isRecord)
      .map(async (author): Promise<Author> => {
        const avatar = optionalString(author.avatar);

        return {
          name: optionalString(author.name) ?? '',
          bio: optionalString(author.bio) ?? '',
          avatar:
            avatar === undefined
              ? undefined
              : await images.picture(join(contentDir, avatar), {
                  displayWidth: options.avatarWidth,
                  square: true,
                }),
        };
      }),
  );

  const postsDir = join(contentDir, 'posts');
  const slugs = (await readdir(postsDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && existsSync(join(postsDir, entry.name, 'index.md')))
    .map((entry) => entry.name);

  const compiled = await Promise.all(
    slugs.map(async (slug): Promise<Post | undefined> => {
      const file = join(postsDir, slug, 'index.md');
      const where = relative(process.cwd(), file);
      const { frontmatter, html, text, excerpt } = await compileMarkdown(file);

      if (frontmatter.draft === true && !options.includeDrafts) return undefined;

      const { title, image, author } = frontmatter;
      if (typeof title !== 'string' || title.trim() === '') {
        throw new Error(`${where}: frontmatter needs a "title"`);
      }

      const date = new Date(String(frontmatter.date));
      if (Number.isNaN(date.getTime())) {
        throw new Error(`${where}: frontmatter "date" is missing or not a date`);
      }

      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [];

      return {
        slug,
        title: title.trim(),
        date: date.toISOString(),
        dateLabel: dateLabel(date),
        tags: tags.map(toTag),
        author: typeof author === 'string' ? author : '',
        cover:
          typeof image === 'string'
            ? await images.cover(join(postsDir, slug, image), { displayWidth: options.coverWidth })
            : undefined,
        excerpt,
        html,
        text,
      };
    }),
  );

  const posts = compiled
    .filter((post): post is Post => post !== undefined)
    .sort((a, b) => b.date.localeCompare(a.date));

  const tags = [
    ...new Map(posts.flatMap((post) => post.tags).map((tag) => [tag.slug, tag])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name, locale));

  const imageDir = join(contentDir, 'img');
  const imageFiles = existsSync(imageDir)
    ? (await readdir(imageDir)).filter((name) => RASTER.has(extname(name).toLowerCase()))
    : [];
  const siteImages = Object.fromEntries(
    await Promise.all(
      imageFiles.map(async (name): Promise<[string, Cover]> => [
        name,
        await images.cover(join(imageDir, name), { displayWidth: options.coverWidth }),
      ]),
    ),
  );

  return { posts, authors, tags, images: siteImages };
};

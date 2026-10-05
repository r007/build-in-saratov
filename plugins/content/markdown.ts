import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import rehypeShiki from '@shikijs/rehype';
import type { Element, ElementContent, Root as HastRoot } from 'hast';
import type { Code, Parent, Root as MdastRoot, RootContent } from 'mdast';
import { toString as mdastToString } from 'mdast-util-to-string';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSmartypants from 'remark-smartypants';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import { parse as parseYaml } from 'yaml';
import type { ImagePipeline } from './images.ts';

export interface MarkdownOptions {
  /** The widest an image is laid out inside an article, in CSS pixels. */
  imageWidth: number;
  /** Shiki theme for fenced code. */
  codeTheme: string;
  /** Accessible name for an `<iframe>` that does not carry its own title. */
  embedTitle: string;
  /** Accessible name for the scrollable region around a table. */
  tableLabel: string;
  /** Characters of prose kept as the excerpt. */
  excerptLength: number;
}

export interface CompiledMarkdown {
  frontmatter: Record<string, unknown>;
  html: string;
  text: string;
  excerpt: string;
}

/** A container for images laid out side by side; see `remarkImageGrid`. */
interface ImageGrid extends Parent {
  type: 'imageGrid';
  children: RootContent[];
}

declare module 'mdast' {
  interface RootContentMap {
    imageGrid: ImageGrid;
  }
}

/** Fence languages the posts use that Shiki knows under another name. */
const LANGUAGE_ALIASES = { apacheconfig: 'apache' };

/** A fenced block such as ```grid|2 holding one Markdown image per line. */
const GRID_FENCE = /^grid(?:\|(?<columns>\d+))?$/v;

/** An HTML attribute as a string; anything else (absent, boolean, list) is empty. */
const asText = (value: unknown): string => (typeof value === 'string' ? value : '');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isRelative = (url: string): boolean => !/^(?:[a-z][a-z\d+.\-]*:|\/|#)/iv.test(url);

const isElement = (node: ElementContent | undefined, tagName: string): node is Element =>
  node?.type === 'element' && node.tagName === tagName;

const isWhitespace = (node: ElementContent): boolean =>
  (node.type === 'text' && node.value.trim() === '') || isElement(node, 'br');

/**
 * Cuts prose at a word boundary.
 *
 * Mid-word truncation reads as a rendering fault in a card, and in Russian it
 * can leave a fragment that is a different word entirely.
 */
const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text;

  const cut = text.slice(0, length);
  const boundary = cut.lastIndexOf(' ');

  return `${(boundary > 0 ? cut.slice(0, boundary) : cut).replace(/[\s.,;:!?–—\-]+$/v, '')}…`;
};

/**
 * Turns a ```grid|N fence into a container of its images.
 *
 * The fence body is ordinary Markdown, parsed with the same grammar as the
 * article around it, so images inside a grid get the same responsive variants
 * and captions as any other.
 */
const remarkImageGrid = () => (tree: MdastRoot) => {
  visit(tree, 'code', (node: Code, index, parent: Parent | undefined) => {
    const match = GRID_FENCE.exec(node.lang ?? '');
    if (!match || index === undefined || !parent) return undefined;

    const columns = Number(match.groups?.columns ?? 2);
    const inner = unified().use(remarkParse).parse(node.value);

    parent.children[index] = {
      type: 'imageGrid',
      children: inner.children,
      data: {
        hName: 'div',
        hProperties: { className: ['image-grid'], style: `--image-grid-columns:${columns}` },
      },
    } satisfies ImageGrid;

    return SKIP;
  });
};

/**
 * Replaces Markdown images with responsive `<figure>`s.
 *
 * Every relative image is resized into WebP variants and given its real
 * dimensions, so the page never shifts as pictures arrive, and its alt text
 * doubles as a visible caption. A paragraph made only of images is unwrapped,
 * because a `<figure>` may not live inside a `<p>`.
 */
const rehypeFigures =
  (images: ImagePipeline, directory: string, imageWidth: number) =>
  () =>
  async (tree: HastRoot): Promise<void> => {
    const found: Element[] = [];
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img' && isRelative(asText(node.properties.src))) found.push(node);
    });

    await Promise.all(
      found.map(async (node) => {
        const file = resolve(directory, decodeURIComponent(asText(node.properties.src)));
        const picture = await images.picture(file, { displayWidth: imageWidth });

        node.properties = {
          ...node.properties,
          src: picture.src,
          srcSet: picture.srcSet || undefined,
          sizes: picture.srcSet
            ? `(max-width: ${picture.width}px) 100vw, ${picture.width}px`
            : undefined,
          width: picture.width,
          height: picture.height,
          loading: 'lazy',
          decoding: 'async',
          style: `background-color:${picture.color}`,
          dataZoomable: true,
        };
      }),
    );

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p' || index === undefined || !parent) return undefined;

      const pictures = node.children.filter((child) => isElement(child, 'img'));
      const onlyPictures = node.children.every(
        (child) => isElement(child, 'img') || isWhitespace(child),
      );
      if (pictures.length === 0 || !onlyPictures) return undefined;

      const figures = pictures.map((picture): Element => {
        const caption = isElement(picture, 'img') ? asText(picture.properties.alt) : '';

        return {
          type: 'element',
          tagName: 'figure',
          properties: {},
          children: [
            picture,
            ...(caption
              ? [
                  {
                    type: 'element' as const,
                    tagName: 'figcaption',
                    properties: {},
                    children: [{ type: 'text' as const, value: caption }],
                  },
                ]
              : []),
          ],
        };
      });

      parent.children.splice(index, 1, ...figures);
      return [SKIP, index + figures.length];
    });
  };

/**
 * Makes embeds and tables behave at any width.
 *
 * An `<iframe>` keeps the aspect ratio it was authored with instead of a fixed
 * pixel size, and a table that is wider than the column scrolls inside its own
 * focusable region rather than pushing the whole page sideways — focusable so
 * that a keyboard user can scroll it too.
 */
const rehypeResponsiveBlocks =
  ({ embedTitle, tableLabel }: Pick<MarkdownOptions, 'embedTitle' | 'tableLabel'>) =>
  () =>
  (tree: HastRoot): void => {
    visit(tree, 'element', (node, index, parent) => {
      if (index === undefined || !parent) return undefined;

      if (node.tagName === 'iframe') {
        const { width, height, frameBorder: _frameBorder, ...properties } = node.properties;
        const ratio = Number(width) > 0 && Number(height) > 0 ? `${width} / ${height}` : '16 / 9';

        node.properties = { title: embedTitle, ...properties, loading: 'lazy' };
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['embed'], style: `aspect-ratio:${ratio}` },
          children: [node],
        };
        return SKIP;
      }

      if (node.tagName === 'table') {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: {
            className: ['table-scroll'],
            role: 'region',
            ariaLabel: tableLabel,
            tabIndex: 0,
          },
          children: [node],
        };
        return SKIP;
      }

      return undefined;
    });
  };

const SKIPPED_IN_TEXT = new Set(['yaml', 'code', 'html', 'imageGrid']);

export const createMarkdownCompiler = (images: ImagePipeline, options: MarkdownOptions) => {
  const markdown = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkSmartypants)
    .use(remarkImageGrid);

  return async (file: string): Promise<CompiledMarkdown> => {
    const source = await readFile(file, 'utf8');
    const parsed = markdown.parse(source);
    // The transforms above rewrite the tree in place, so this is the same root.
    await markdown.run(parsed);
    const tree: MdastRoot = parsed;

    const yaml = tree.children.find((node) => node.type === 'yaml');
    const data: unknown = yaml ? parseYaml(yaml.value) : undefined;
    const frontmatter = isRecord(data) ? data : {};

    const text = tree.children
      .filter((node) => !SKIPPED_IN_TEXT.has(node.type))
      .map((node) => mdastToString(node, { includeImageAlt: false }))
      .join(' ')
      .replace(/\s+/gv, ' ')
      .trim();

    const html = unified()
      .use(remarkRehype, { allowDangerousHtml: true })
      // Posts embed raw HTML (video iframes); parse it into the tree so the
      // steps below can see it instead of passing it through as a string.
      .use(rehypeRaw)
      .use(rehypeShiki, {
        theme: options.codeTheme,
        langAlias: LANGUAGE_ALIASES,
        defaultLanguage: 'text',
        fallbackLanguage: 'text',
        lazy: true,
      })
      .use(rehypeFigures(images, dirname(file), options.imageWidth))
      .use(rehypeResponsiveBlocks(options))
      .use(rehypeStringify);

    const body: MdastRoot = {
      ...tree,
      children: tree.children.filter((node) => node.type !== 'yaml'),
    };

    return {
      frontmatter,
      html: html.stringify(await html.run(body)),
      text,
      excerpt: truncate(text, options.excerptLength),
    };
  };
};

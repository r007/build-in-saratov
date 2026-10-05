import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';
import type { Cover, Picture } from '../../app/content/types.ts';

/**
 * Bumped whenever the encoding settings below change, so every image is
 * re-encoded instead of the stale variants being found on disk and kept.
 */
const SETTINGS_VERSION = 1;

const WEBP_QUALITY = 82;
const JPEG_QUALITY = 85;

/** Open Graph's recommended width. */
const SOCIAL_WIDTH = 1200;

/** Passed through untouched: re-encoding would drop animation or vectors. */
const COPIED_FORMATS = new Set(['.gif', '.svg']);

export interface PictureOptions {
  /** The widest the image is ever laid out, in CSS pixels. */
  displayWidth: number;
  /** Crop to a square of `displayWidth`, for avatars. */
  square?: boolean;
}

export interface ImagePipeline {
  picture: (file: string, options: PictureOptions) => Promise<Picture>;
  cover: (file: string, options: PictureOptions) => Promise<Cover>;
}

const toHex = ({ r, g, b }: { r: number; g: number; b: number }): string =>
  `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;

/**
 * Candidate widths for one image: half, full, one-and-a-half and double the
 * display width, never upscaling. A phone gets the small file, a retina laptop
 * the large one, and nobody downloads pixels their screen cannot show.
 */
const variantWidths = (intrinsic: number, display: number): number[] => {
  const candidates = [0.5, 1, 1.5, 2].map((factor) => Math.round(display * factor));
  const fitting = candidates.filter((width) => width < intrinsic);

  // The original size is itself a variant when it is not much larger than the
  // biggest candidate, which is every screenshot narrower than the column.
  if (intrinsic <= display * 2) fitting.push(intrinsic);

  return [...new Set(fitting)].sort((a, b) => a - b);
};

/**
 * Turns source images into hashed, responsive files under `outDir`.
 *
 * Names carry a hash of the source bytes and the settings, which buys two
 * things: a variant already on disk is known to be current and is skipped, so
 * only changed images cost anything on a rebuild; and the files can be cached
 * for a year, because a different image is a different URL.
 */
export const createImagePipeline = (outDir: string, publicPath: string): ImagePipeline => {
  const pending = new Map<string, Promise<Picture>>();

  const emit = async (target: string, write: (path: string) => Promise<unknown>): Promise<void> => {
    const path = join(outDir, target);
    if (existsSync(path)) return;
    await write(path);
  };

  const build = async (file: string, options: PictureOptions): Promise<Picture> => {
    await mkdir(outDir, { recursive: true });

    const source = await readFile(file);
    const extension = extname(file).toLowerCase();
    const hash = createHash('sha1')
      .update(source)
      .update(JSON.stringify([SETTINGS_VERSION, options]))
      .digest('hex')
      .slice(0, 10);
    const stem = `${basename(file, extname(file))}.${hash}`;

    const metadata = await sharp(source).metadata();
    const intrinsicWidth = metadata.width;
    const intrinsicHeight = metadata.pageHeight ?? metadata.height;

    if (COPIED_FORMATS.has(extension)) {
      const target = `${stem}${extension}`;
      await emit(target, async (path) => {
        await copyFile(file, path);
      });

      const width = Math.min(intrinsicWidth, options.displayWidth);

      return {
        src: `${publicPath}/${target}`,
        srcSet: '',
        width,
        height: Math.round((intrinsicHeight * width) / intrinsicWidth),
        color: 'transparent',
      };
    }

    const { dominant } = await sharp(source).stats();
    const widths = variantWidths(intrinsicWidth, options.displayWidth);

    const variants = await Promise.all(
      widths.map(async (width) => {
        const target = `${stem}-${width}.webp`;
        await emit(target, async (path) => {
          await sharp(source)
            .resize(
              options.square
                ? { width, height: width, fit: 'cover', position: 'centre' }
                : { width, withoutEnlargement: true },
            )
            .webp({ quality: WEBP_QUALITY })
            .toFile(path);
        });

        return { width, url: `${publicPath}/${target}` };
      }),
    );

    const width = Math.min(intrinsicWidth, options.displayWidth);
    const fallback = variants.find((variant) => variant.width >= width) ?? variants.at(-1);
    if (!fallback) throw new Error(`No variants were produced for ${file}`);

    return {
      src: fallback.url,
      srcSet: variants.map((variant) => `${variant.url} ${variant.width}w`).join(', '),
      width,
      height: options.square ? width : Math.round((intrinsicHeight * width) / intrinsicWidth),
      color: toHex(dominant),
    };
  };

  const picture: ImagePipeline['picture'] = async (file, options) => {
    const key = `${file}\u0000${JSON.stringify(options)}`;
    const cached = pending.get(key);
    if (cached) return await cached;

    const created = build(file, options);
    pending.set(key, created);
    return await created;
  };

  const cover: ImagePipeline['cover'] = async (file, options) => {
    const base = await picture(file, options);

    const source = await readFile(file);
    const hash = createHash('sha1')
      .update(source)
      .update(JSON.stringify([SETTINGS_VERSION, 'social']))
      .digest('hex')
      .slice(0, 10);
    const target = `${basename(file, extname(file))}.${hash}-social.jpg`;

    await emit(target, async (path) => {
      await sharp(source)
        .resize({ width: SOCIAL_WIDTH, withoutEnlargement: true })
        // Transparent PNGs would otherwise flatten to black in a JPEG.
        .flatten({ background: '#ffffff' })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(path);
    });

    return { ...base, social: `${publicPath}/${target}` };
  };

  return { picture, cover };
};

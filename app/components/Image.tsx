import type { Picture } from '~/content/types';

export interface ImageProps {
  source: Picture;
  /** Describes the image; pass an empty string when it is purely decorative. */
  alt: string;
  /**
   * How wide the image is laid out, as a `sizes` value. Defaults to "as wide as
   * the viewport, up to its own width", which is right for a full-bleed image
   * and wasteful for a thumbnail — say so when the slot is smaller.
   */
  sizes?: string;
  /** `eager` for the image a page opens on; everything else loads lazily. */
  priority?: boolean;
  className?: string;
}

/**
 * A responsive image that never shifts the layout.
 *
 * Width and height reserve the space, the dominant colour fills it while the
 * file loads, and `srcset` lets the browser pick the smallest variant that is
 * sharp on its screen.
 */
export const Image = ({ source, alt, sizes, priority = false, className }: ImageProps) => (
  <img
    className={className}
    src={source.src}
    srcSet={source.srcSet || undefined}
    sizes={
      source.srcSet
        ? (sizes ?? `(max-width: ${source.width}px) 100vw, ${source.width}px`)
        : undefined
    }
    width={source.width}
    height={source.height}
    alt={alt}
    loading={priority ? 'eager' : 'lazy'}
    fetchPriority={priority ? 'high' : undefined}
    decoding="async"
    style={{ backgroundColor: source.color }}
  />
);

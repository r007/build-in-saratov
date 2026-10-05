import type { Glyph } from './glyphs';

export interface IconProps {
  glyph: Glyph;
  /** Any CSS length. Defaults to the surrounding text size. */
  size?: string;
  /**
   * An accessible name. Give one only when the icon stands alone as the
   * content; next to visible text an icon is decoration and stays silent.
   */
  label?: string;
  className?: string;
}

/** Draws a glyph. Coloured by the surrounding text colour. */
export const Icon = ({ glyph, size = '1em', label, className }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={glyph.viewBox}
    width={size}
    height={size}
    className={className}
    focusable="false"
    {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    {...(glyph.style === 'stroke'
      ? {
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }
      : { fill: 'currentColor' })}
  >
    {glyph.paths.map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
);

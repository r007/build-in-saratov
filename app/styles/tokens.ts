/**
 * Design tokens.
 *
 * The colours are mirrored as custom properties in `global.css`, which is what
 * plain CSS (the article typography) reads; components read them from here.
 *
 * Contrast is measured, not assumed: every text/background pair in use clears
 * WCAG AAA (7:1), with one exception — `accent` on `surfaceMuted` is 6.3:1,
 * which is AA. The ratios in the comments below are against the named surface.
 */
export const color = {
  /** Primary blue: headers, links, focus rings. 9.5:1 on white. */
  brand: '#164194',
  /** Navigation background. 10.2:1 against `sky`, 16:1 against white. */
  brandDark: '#1a1f3e',
  /** Magenta accent: eyebrows, captions, hover bars. 7.1:1 on white. */
  accent: '#ad005f',
  /** Light blue used for text and controls on `brandDark`. */
  sky: '#aad2ff',
  skyLight: '#bfddff',
  ink: '#15171a',
  inkMuted: '#3d4247',
  surface: '#ffffff',
  surfaceMuted: '#f0f0f0',
  field: '#f3f3f3',
  border: '#6f6f6f',
  page: '#f4f8fb',
  placeholder: '#c5d2d9',
  danger: '#a2191f',
  dangerSurface: '#fff1f1',
  success: '#0e6027',
  successSurface: '#defbe6',
} as const;

/**
 * Desktop-first breakpoints, as `max-width` media queries.
 *
 * `navigation` is the width below which the sidebar gives way to the bottom
 * tab bar — the two must switch at the same point, so both read it from here.
 */
const maxWidth = (pixels: number): `@media (max-width: ${number}px)` =>
  `@media (max-width: ${pixels}px)`;

export const media = {
  wide: maxWidth(1560),
  navigation: maxWidth(1280),
  phone: maxWidth(600),
  abovePhone: '@media (min-width: 601px)',
} as const;

export const easing = 'cubic-bezier(0.645, 0.045, 0.355, 1)';

import { makeStyles, mergeClasses } from '@griffel/react';
import type { ReactNode } from 'react';
import { color, easing, media } from '../styles/tokens';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    padding: '2.5rem var(--gutter-end) 3rem var(--gutter-start)',
    backgroundColor: color.brand,
    color: color.surface,
    [media.wide]: { paddingTop: '1.5rem', paddingBottom: '2rem' },
    // Links in the banner's own text. Scoped to paragraphs so that a linked
    // logo or an icon button placed here keeps its own appearance.
    '& p a': {
      color: color.surface,
      borderBottom: `2px solid ${color.surface}`,
      transitionProperty: 'background-color, border-color',
      transitionDuration: '0.3s',
      transitionTimingFunction: easing,
    },
    '& p a:hover': { backgroundColor: color.brandDark, borderBottomColor: color.brandDark },
  },
  screen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100svh - var(--tabbar-height))',
    paddingTop: '2rem',
    textAlign: 'center',
  },
  image: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    // Text sits on top of the picture; the shadow keeps it readable whatever
    // colours happen to be behind it.
    textShadow: '0 2px 14px rgba(0, 0, 0, 0.75)',
  },
  lead: {
    marginBottom: '1rem',
  },
  eyebrow: {
    margin: 0,
    maxWidth: 'none',
    fontSize: '0.7rem',
    fontWeight: 600,
    lineHeight: 1.45,
    textTransform: 'uppercase',
    [media.phone]: { fontSize: '1rem', lineHeight: 1.3 },
  },
  title: {
    margin: 0,
    [media.navigation]: { fontSize: '1.575rem' },
  },
});

export interface BannerProps {
  /** The page's main heading. */
  title: ReactNode;
  /** A short line above the title: a date, a category, a label. */
  eyebrow?: ReactNode;
  /** Shown above the eyebrow and title, e.g. a logo or a large numeral. */
  lead?: ReactNode;
  /** `screen` fills the viewport and centres its content. */
  size?: 'auto' | 'screen';
  /** URL of a decorative image, drawn contained behind the text. */
  backgroundImage?: string;
  /** Shown below the title. */
  children?: ReactNode;
}

/** The coloured band that opens a page and carries its `<h1>`. */
export const Banner = ({
  title,
  eyebrow,
  lead,
  size = 'auto',
  backgroundImage,
  children,
}: BannerProps) => {
  const styles = useStyles();

  return (
    <header
      className={mergeClasses(
        styles.root,
        size === 'screen' && styles.screen,
        backgroundImage !== undefined && styles.image,
      )}
      style={
        backgroundImage === undefined ? undefined : { backgroundImage: `url(${backgroundImage})` }
      }
    >
      {lead ? <div className={styles.lead}>{lead}</div> : null}
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h1 className={styles.title}>{title}</h1>
      {children}
    </header>
  );
};

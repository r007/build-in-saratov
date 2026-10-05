import { makeStyles, mergeClasses } from '@griffel/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { Picture } from '~/content/types';
import { color, media } from '../styles/tokens';
import { Image } from './Image';

/** Width from which a featured card lays out its text beside its image. */
const SIDE_BY_SIDE = '@media (min-width: 1281px)';
/** Width from which a featured card takes a full row at all. */
const FULL_ROW = '@media (min-width: 795px)';

const useStyles = makeStyles({
  root: {
    flex: '1 1 300px',
    minWidth: 0,
    backgroundColor: color.surface,
    [media.abovePhone]: { margin: '0 20px 40px' },
  },
  link: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: color.ink,
    ':hover [data-slot="bar"]': {
      transform: 'scaleX(1)',
      backgroundColor: color.accent,
      transitionDuration: '0.2s',
    },
    ':focus-visible [data-slot="bar"]': {
      transform: 'scaleX(1)',
      backgroundColor: color.accent,
    },
  },
  media: {
    position: 'relative',
    height: '300px',
    marginBottom: '25px',
    backgroundColor: color.placeholder,
  },
  image: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  // The accent bar under the image: a quarter wide at rest, full on hover.
  bar: {
    position: 'absolute',
    right: 0,
    bottom: '-5px',
    left: 0,
    height: '5px',
    backgroundColor: color.brand,
    transform: 'scaleX(0.25)',
    transformOrigin: '0 0',
    transitionProperty: 'transform, background-color',
    transitionDuration: '0.4s',
  },
  body: {
    flexGrow: 1,
  },
  eyebrow: {
    display: 'block',
    marginBottom: '10px',
    color: color.accent,
    fontWeight: 500,
    lineHeight: 1.15,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    [media.abovePhone]: { fontSize: '0.6rem' },
  },
  title: {
    margin: '0 0 0.75em',
    color: color.brand,
    [media.abovePhone]: { fontSize: '1rem' },
  },
  description: {
    margin: 0,
    [media.abovePhone]: { fontSize: '0.7rem' },
  },

  featured: {
    [FULL_ROW]: {
      flexBasis: '100%',
      padding: '20px',
      backgroundColor: color.surfaceMuted,
    },
    [SIDE_BY_SIDE]: { padding: '35px' },
  },
  featuredLink: {
    [SIDE_BY_SIDE]: { flexDirection: 'row' },
  },
  featuredMedia: {
    [SIDE_BY_SIDE]: {
      order: 2,
      flex: '1 1 auto',
      height: 'auto',
      minHeight: '300px',
      marginBottom: 0,
    },
  },
  featuredImage: {
    [SIDE_BY_SIDE]: { position: 'absolute', inset: 0 },
  },
  featuredBody: {
    [SIDE_BY_SIDE]: {
      order: 1,
      flex: '0 1 calc(40% + 35px)',
      paddingRight: '35px',
      paddingTop: '18px',
    },
  },
  // Side by side, the bar moves from under the image to above the text.
  featuredMediaBar: {
    [SIDE_BY_SIDE]: { display: 'none' },
  },
  featuredBodyBar: {
    display: 'none',
    [SIDE_BY_SIDE]: { display: 'block', top: 0, bottom: 'auto', right: '35px', height: '8px' },
  },
  featuredTitle: {
    [SIDE_BY_SIDE]: { fontSize: '1.3rem' },
  },
  featuredDescription: {
    [SIDE_BY_SIDE]: { fontSize: '0.9rem', lineHeight: 1.55 },
  },
});

export interface CardProps {
  /** Where the whole card links. */
  to: string;
  title: string;
  /** A short label above the title: a category, a kicker. */
  eyebrow?: string;
  description?: ReactNode;
  image?: Picture;
  /** Alternative text for the image; empty when the title already says it. */
  imageAlt?: string;
  /**
   * Give the card a full row and, on wide screens, set its text beside its
   * image. Has no effect on a card without an image.
   */
  featured?: boolean;
  /** Heading level of the title, to fit the page's outline. */
  headingLevel?: 2 | 3 | 4;
  className?: string;
}

/** A linked teaser: optional image, eyebrow, title and description. */
export const Card = ({
  to,
  title,
  eyebrow,
  description,
  image,
  imageAlt = '',
  featured = false,
  headingLevel = 2,
  className,
}: CardProps) => {
  const styles = useStyles();
  const Heading = `h${headingLevel}` as const;
  const wide = featured && image !== undefined;

  return (
    <article className={mergeClasses(styles.root, wide && styles.featured, className)}>
      <Link
        className={mergeClasses(styles.link, wide && styles.featuredLink)}
        to={to}
        prefetch="intent"
      >
        {image ? (
          <div className={mergeClasses(styles.media, wide && styles.featuredMedia)}>
            <Image
              className={mergeClasses(styles.image, wide && styles.featuredImage)}
              source={image}
              alt={imageAlt}
              sizes={
                wide
                  ? '(max-width: 1280px) 100vw, 60vw'
                  : '(max-width: 795px) 100vw, (max-width: 1280px) 50vw, 33vw'
              }
            />
            <span
              className={mergeClasses(styles.bar, wide && styles.featuredMediaBar)}
              data-slot="bar"
            />
          </div>
        ) : null}
        <div className={mergeClasses(styles.body, wide && styles.featuredBody)}>
          {wide ? (
            <span className={mergeClasses(styles.bar, styles.featuredBodyBar)} data-slot="bar" />
          ) : null}
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <Heading className={mergeClasses(styles.title, wide && styles.featuredTitle)}>
            {title}
          </Heading>
          {description ? (
            <p className={mergeClasses(styles.description, wide && styles.featuredDescription)}>
              {description}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
};

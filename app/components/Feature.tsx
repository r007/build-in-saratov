import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { color } from '../styles/tokens';
import type { Glyph } from './glyphs';
import { Icon } from './Icon';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '2rem 1.5rem',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 0,
    listStyleType: 'none',
    '@media (max-width: 960px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  },
  item: {
    margin: 0,
    padding: 0,
    textAlign: 'center',
  },
  link: {
    display: 'block',
    color: color.ink,
    ':hover [data-slot="icon"]': { transform: 'translateY(-5px)' },
  },
  icon: {
    display: 'inline-flex',
    color: color.brand,
    fontSize: '96px',
    transitionProperty: 'transform',
    transitionDuration: '250ms',
    transitionTimingFunction: 'ease-in-out',
    '@media (max-width: 960px)': { fontSize: '80px' },
    '@media (max-width: 480px)': { fontSize: '71px' },
  },
  title: {
    margin: '1rem 0 0',
    fontSize: '1rem',
  },
  description: {
    maxWidth: '100%',
    margin: '0.4rem 0 0',
    fontSize: '0.7rem',
    lineHeight: 1.5,
  },
});

export interface FeatureProps {
  glyph: Glyph;
  title: string;
  description?: ReactNode;
  to: string;
  headingLevel?: 3 | 4;
}

/** A large icon over a title and a line of text, linked as a whole. */
export const Feature = ({ glyph, title, description, to, headingLevel = 3 }: FeatureProps) => {
  const styles = useStyles();
  const Heading = `h${headingLevel}` as const;

  return (
    <li className={styles.item}>
      <Link className={styles.link} to={to} prefetch="intent">
        <span className={styles.icon} data-slot="icon">
          <Icon glyph={glyph} />
        </span>
        <Heading className={styles.title}>{title}</Heading>
        {description ? <p className={styles.description}>{description}</p> : null}
      </Link>
    </li>
  );
};

export interface FeatureGridProps {
  /** `<Feature>` elements. */
  children: ReactNode;
}

/** Four features in a row, two on narrow screens. */
export const FeatureGrid = ({ children }: FeatureGridProps) => {
  const styles = useStyles();

  return <ul className={styles.grid}>{children}</ul>;
};

import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { color, easing } from '../styles/tokens';
import { glyphs } from './glyphs';
import { Icon } from './Icon';

const useStyles = makeStyles({
  root: {
    maxWidth: '45rem',
    margin: '0 auto 1.5rem',
    textAlign: 'center',
  },
  title: {
    maxWidth: '100%',
    margin: '0.8rem 0 0.5rem',
    fontWeight: 300,
    '::after': {
      content: '""',
      display: 'block',
      width: '30px',
      height: '2px',
      margin: '24px auto 0',
      backgroundColor: color.accent,
    },
  },
  description: {
    maxWidth: '100%',
    margin: 0,
    fontSize: '0.8rem',
  },
  action: {
    display: 'inline-flex',
    alignItems: 'center',
    marginTop: '0.5rem',
    ':hover [data-slot="arrow"]': { opacity: 1, transform: 'translateX(0.5em)' },
    ':focus-visible [data-slot="arrow"]': { opacity: 1, transform: 'translateX(0.5em)' },
  },
  arrow: {
    display: 'inline-flex',
    opacity: 0,
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: easing,
  },
});

export interface SectionHeaderProps {
  title: string;
  description?: ReactNode;
  /** A link to more of whatever the section previews. */
  action?: { to: string; label: string };
  headingLevel?: 2 | 3;
}

/** A centred heading that opens a section, with an optional lead and link. */
export const SectionHeader = ({
  title,
  description,
  action,
  headingLevel = 2,
}: SectionHeaderProps) => {
  const styles = useStyles();
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={styles.root}>
      <Heading className={styles.title}>{title}</Heading>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? (
        <Link className={styles.action} to={action.to} prefetch="intent">
          {action.label}
          <span className={styles.arrow} data-slot="arrow">
            <Icon glyph={glyphs.arrowRight} size="0.8em" />
          </span>
        </Link>
      ) : null}
    </div>
  );
};

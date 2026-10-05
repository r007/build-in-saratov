import { makeStyles } from '@griffel/react';
import { glyphs } from './glyphs';
import { Icon } from './Icon';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    bottom: '8vh',
    left: 'calc(50% - 22px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '44px',
    height: '44px',
    color: 'inherit',
    fontSize: '1.7rem',
    animationName: { to: { transform: 'translateY(20px)' } },
    animationDuration: '1.6s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    animationDirection: 'alternate',
  },
  // The artwork is a right-pointing arrow; turned a quarter it points down.
  arrow: {
    display: 'inline-flex',
    transform: 'rotate(90deg)',
  },
});

export interface ScrollCueProps {
  /** Fragment of the element to scroll to, e.g. `#content`. */
  href: string;
  /** Accessible name; the arrow itself says nothing to a screen reader. */
  label: string;
}

/** A bobbing arrow at the foot of a full-height area that scrolls past it. */
export const ScrollCue = ({ href, label }: ScrollCueProps) => {
  const styles = useStyles();

  return (
    <a className={styles.root} href={href} aria-label={label}>
      <span className={styles.arrow}>
        <Icon glyph={glyphs.arrowRight} />
      </span>
    </a>
  );
};

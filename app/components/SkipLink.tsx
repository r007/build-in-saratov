import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';
import { color } from '../styles/tokens';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: '0.5rem',
    left: '0.5rem',
    zIndex: 1000,
    padding: '0.5em 1em',
    backgroundColor: color.surface,
    color: color.brand,
    fontWeight: 700,
    // Off-screen until focused, rather than `display: none`, so it stays in
    // the tab order.
    transform: 'translateY(-200%)',
    ':focus': { transform: 'none' },
  },
});

export interface SkipLinkProps {
  /** Fragment of the element to jump to, e.g. `#content`. */
  href: string;
  children: ReactNode;
}

/** Lets keyboard users jump past the navigation. Visible only when focused. */
export const SkipLink = ({ href, children }: SkipLinkProps) => {
  const styles = useStyles();

  return (
    <a className={styles.root} href={href}>
      {children}
    </a>
  );
};

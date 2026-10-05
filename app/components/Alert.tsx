import { makeStyles, mergeClasses } from '@griffel/react';
import type { ReactNode } from 'react';
import { color } from '../styles/tokens';

const useStyles = makeStyles({
  root: {
    maxWidth: 'var(--measure)',
    margin: '0 0 1rem',
    padding: '0.75rem 1.25rem',
    borderLeft: '0.3rem solid currentColor',
    fontSize: '0.8rem',
    fontWeight: 600,
    ':focus': { outlineStyle: 'none' },
  },
  success: { backgroundColor: color.successSurface, color: color.success },
  danger: { backgroundColor: color.dangerSurface, color: color.danger },
});

export interface AlertProps {
  tone: 'success' | 'danger';
  children: ReactNode;
}

/**
 * A message about the outcome of something the reader just did.
 *
 * Announced by screen readers as it appears: politely for good news, and
 * immediately for a failure that needs acting on.
 */
export const Alert = ({ tone, children }: AlertProps) => {
  const styles = useStyles();

  return (
    <p
      className={mergeClasses(styles.root, styles[tone])}
      role={tone === 'danger' ? 'alert' : 'status'}
    >
      {children}
    </p>
  );
};

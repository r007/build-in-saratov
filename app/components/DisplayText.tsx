import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';

const useStyles = makeStyles({
  root: {
    maxWidth: 'none',
    margin: 0,
    fontSize: 'clamp(4rem, 12vw, 12rem)',
    lineHeight: 1,
    letterSpacing: '-0.04em',
  },
});

export interface DisplayTextProps {
  children: ReactNode;
}

/** Oversized text for a single word or number. Not a heading. */
export const DisplayText = ({ children }: DisplayTextProps) => {
  const styles = useStyles();

  return <p className={styles.root}>{children}</p>;
};

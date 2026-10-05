import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    // Cancels the outer margin of the cards so the row aligns with the gutters.
    '@media (min-width: 601px)': { margin: '0 -20px' },
  },
});

export interface CardGridProps {
  children: ReactNode;
}

/** Lays cards out in rows that wrap; each card takes at least 300px. */
export const CardGrid = ({ children }: CardGridProps) => {
  const styles = useStyles();

  return <div className={styles.root}>{children}</div>;
};

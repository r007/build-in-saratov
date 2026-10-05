import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    // Spacing comes from the gap alone, so children placed here need no
    // margins of their own to sit evenly.
    '& > *': { marginTop: 0, marginBottom: 0 },
  },
});

export interface StackProps {
  /** Space between children, as any CSS length. */
  gap?: string;
  children: ReactNode;
}

/** Stacks its children vertically with even space between them. */
export const Stack = ({ gap = '1.5rem', children }: StackProps) => {
  const styles = useStyles();

  return (
    <div className={styles.root} style={{ gap }}>
      {children}
    </div>
  );
};

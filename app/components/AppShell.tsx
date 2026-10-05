import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';

const useStyles = makeStyles({
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100svh - var(--tabbar-height))',
    // The sidebar is fixed, so the content starts where it ends.
    marginLeft: 'var(--sidebar-width)',
    // Focused programmatically by the skip link; a ring around the whole page
    // would only be noise.
    ':focus': { outlineStyle: 'none' },
  },
});

export interface AppShellProps {
  /** Rendered first in the document, so it is the first thing Tab reaches. */
  skipLink?: ReactNode;
  /** Navigation for wide screens. */
  sidebar?: ReactNode;
  /** Navigation for narrow screens. */
  tabBar?: ReactNode;
  /** Id of the main landmark; what a skip link points at. */
  mainId: string;
  children: ReactNode;
}

/** Page frame: navigation on the side or the bottom, content in a main landmark. */
export const AppShell = ({ skipLink, sidebar, tabBar, mainId, children }: AppShellProps) => {
  const styles = useStyles();

  return (
    <>
      {skipLink}
      {sidebar}
      <main id={mainId} className={styles.main} tabIndex={-1}>
        {children}
      </main>
      {tabBar}
    </>
  );
};

import { makeStyles, mergeClasses } from '@griffel/react';
import type { ReactNode } from 'react';
import { color } from '../styles/tokens';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    padding: 'var(--gutter-top) var(--gutter-end) var(--gutter-bottom) var(--gutter-start)',
    backgroundColor: color.surface,
  },
  grow: { flexGrow: 1 },
});

export interface SectionProps {
  /** The element to render; a `section` should have a heading inside it. */
  as?: 'section' | 'div' | 'aside' | 'footer';
  /** Take up the remaining height of a flex column, e.g. to fill the page. */
  grow?: boolean;
  /** Names the region for assistive technology when it has no visible heading. */
  label?: string;
  className?: string;
  children: ReactNode;
}

/** A full-width band of content, padded to the page gutters. */
export const Section = ({
  as: Tag = 'section',
  grow,
  label,
  className,
  children,
}: SectionProps) => {
  const styles = useStyles();

  return (
    <Tag className={mergeClasses(styles.root, grow && styles.grow, className)} aria-label={label}>
      {children}
    </Tag>
  );
};

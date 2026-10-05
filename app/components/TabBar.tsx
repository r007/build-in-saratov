import { makeStyles } from '@griffel/react';
import { NavLink } from 'react-router';
import { color, media } from '../styles/tokens';
import type { Glyph } from './glyphs';
import { Icon } from './Icon';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 100,
    display: 'none',
    borderTop: `1px solid ${color.border}`,
    backgroundColor: color.surface,
    // Clears the home indicator on phones without a physical button.
    paddingBottom: 'env(safe-area-inset-bottom)',
    [media.navigation]: { display: 'block' },
  },
  list: {
    display: 'flex',
    justifyContent: 'space-around',
    height: 'var(--tabbar-height)',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  item: {
    flex: '1 1 0',
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.15rem',
    height: '100%',
    color: color.brand,
    fontSize: '0.6rem',
    lineHeight: 1.1,
    textAlign: 'center',
    ':focus-visible': { outlineOffset: '-3px' },
    '&[aria-current="page"]': { fontWeight: 700 },
    '&[aria-current="page"] svg': { fill: '#ffef83' },
    [media.phone]: { fontSize: '0.75rem' },
  },
});

export interface TabBarItem {
  to: string;
  label: string;
  glyph: Glyph;
}

export interface TabBarProps {
  /** Names the landmark for assistive technology. */
  label: string;
  items: readonly TabBarItem[];
}

/** Bottom navigation for narrow screens. Hidden where the sidebar is shown. */
export const TabBar = ({ label, items }: TabBarProps) => {
  const styles = useStyles();

  return (
    <nav className={styles.root} aria-label={label}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.to} className={styles.item}>
            <NavLink className={styles.link} to={item.to} end={item.to === '/'}>
              <Icon glyph={item.glyph} size="1.5rem" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

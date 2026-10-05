import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router';
import { color, easing, media } from '../styles/tokens';
import { glyphs } from './glyphs';
import { Icon } from './Icon';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 950,
    display: 'flex',
    flexDirection: 'column',
    width: 'var(--sidebar-width)',
    padding: '1rem',
    overflowY: 'auto',
    backgroundColor: color.brandDark,
    color: color.skyLight,
    [media.navigation]: { display: 'none' },
  },
  list: {
    margin: '0.6rem 0 0',
    padding: 0,
    listStyleType: 'none',
  },
  item: {
    margin: 0,
    padding: 0,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    margin: '0.35rem 0',
    padding: '0.3em 0 0.4em',
    color: color.skyLight,
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
    lineHeight: 1.3,
    ':hover [data-slot="arrow"]': { opacity: 1, transform: 'translateX(0.5em)' },
    '&[aria-current="page"]': {
      justifyContent: 'space-between',
      paddingRight: '0.6em',
      paddingLeft: '0.6em',
      backgroundColor: color.sky,
      color: color.brandDark,
      letterSpacing: '0.03em',
    },
    '&[aria-current="page"] [data-slot="arrow"]': { opacity: 1 },
  },
  arrow: {
    flexShrink: 0,
    opacity: 0,
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: easing,
  },
  extra: {
    marginTop: '1rem',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: '2rem',
    fontSize: '0.6rem',
    letterSpacing: '0.02em',
  },
});

export interface SidebarItem {
  to: string;
  label: string;
  /** Longer description, shown as a tooltip. */
  hint?: string;
}

export interface SidebarProps {
  /** Names the landmark for assistive technology, e.g. "Main". */
  label: string;
  /** Shown above the links; typically a logo linking home. */
  brand?: ReactNode;
  items: readonly SidebarItem[];
  /** Rendered under the links, e.g. a search field. */
  children?: ReactNode;
  /** Pinned to the bottom. */
  footer?: ReactNode;
}

/** Vertical site navigation for wide screens. Hidden where a tab bar takes over. */
export const Sidebar = ({ label, brand, items, children, footer }: SidebarProps) => {
  const styles = useStyles();

  return (
    <nav className={styles.root} aria-label={label}>
      {brand}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.to} className={styles.item}>
            <NavLink className={styles.link} to={item.to} title={item.hint} end={item.to === '/'}>
              {item.label}
              <span className={styles.arrow} data-slot="arrow">
                <Icon glyph={glyphs.arrowRight} size="0.8em" />
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
      {children ? <div className={styles.extra}>{children}</div> : null}
      {footer ? <div className={styles.footer}>{footer}</div> : null}
    </nav>
  );
};

import { makeStyles } from '@griffel/react';
import { color } from '../styles/tokens';
import type { Glyph } from './glyphs';
import { Icon } from './Icon';

const useStyles = makeStyles({
  heading: {
    margin: '1.45em 0 0.6em',
    fontSize: '1rem',
  },
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    margin: '0 0 20px',
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
    justifyContent: 'center',
    width: '2.75rem',
    height: '2.75rem',
    minWidth: '44px',
    minHeight: '44px',
    borderRadius: '100%',
    backgroundColor: color.brandDark,
    color: color.surface,
    fontSize: '1.1rem',
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
    ':hover': { backgroundColor: color.brand },
  },
});

export interface IconLinkListProps {
  /** Visible heading; also names the list for assistive technology. */
  heading?: string;
  items: ReadonlyArray<{ href: string; label: string; glyph: Glyph }>;
  headingLevel?: 2 | 3 | 4;
}

/**
 * A row of round icon buttons linking off-site.
 *
 * Each icon carries its label as an accessible name, and the targets are at
 * least 44px so they are comfortable to hit with a thumb.
 */
export const IconLinkList = ({ heading, items, headingLevel = 3 }: IconLinkListProps) => {
  const styles = useStyles();
  const Heading = `h${headingLevel}` as const;

  return (
    <>
      {heading ? <Heading className={styles.heading}>{heading}</Heading> : null}
      <ul className={styles.list} aria-label={heading}>
        {items.map((item) => (
          <li key={item.href} className={styles.item}>
            <a
              className={styles.link}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
            >
              <Icon glyph={item.glyph} />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};

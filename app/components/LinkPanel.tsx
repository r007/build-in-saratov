import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { color } from '../styles/tokens';

const useStyles = makeStyles({
  root: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    padding: '25px',
    borderRadius: '5px',
    backgroundColor: color.brand,
    color: color.surface,
    textAlign: 'center',
    [`@media (min-width: 601px)`]: { margin: '0 20px 40px' },
    '& a': { color: color.surface },
  },
  eyebrow: {
    display: 'block',
    maxWidth: '100%',
    margin: '20px 0 0',
    fontSize: '0.8rem',
    lineHeight: 1.3,
  },
  title: {
    maxWidth: '100%',
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 300,
    lineHeight: 1.2,
    letterSpacing: '1px',
  },
  divider: {
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem 0',
  },
  list: {
    flexGrow: 1,
    maxWidth: '100%',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  item: {
    margin: 0,
    padding: 0,
    borderBottom: '1px solid rgba(255, 255, 255, 0.45)',
    lineHeight: 1.25,
  },
  itemLink: {
    display: 'block',
    padding: '0.7rem 0',
    fontWeight: 500,
    ':hover': { textDecorationLine: 'underline' },
  },
  footer: {
    maxWidth: '100%',
    margin: '15px 0 3px',
    fontSize: '0.7rem',
  },
  footerLink: {
    ':hover': { textDecorationLine: 'underline' },
  },
});

export interface LinkPanelProps {
  title: string;
  /** Where the title links, if anywhere. */
  titleTo?: string;
  /** A short label above the title. */
  eyebrow?: string;
  /** Decoration between the title and the list. */
  divider?: ReactNode;
  items: ReadonlyArray<{ to: string; label: string }>;
  /** A closing link, e.g. "all 12 entries". */
  footer?: { to: string; label: string };
  headingLevel?: 2 | 3;
}

/** A solid-coloured panel listing related links under a title. */
export const LinkPanel = ({
  title,
  titleTo,
  eyebrow,
  divider,
  items,
  footer,
  headingLevel = 2,
}: LinkPanelProps) => {
  const styles = useStyles();
  const Heading = `h${headingLevel}` as const;

  return (
    <section className={styles.root}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Heading className={styles.title}>
        {titleTo === undefined ? title : <Link to={titleTo}>{title}</Link>}
      </Heading>
      {divider ? (
        <div className={styles.divider} aria-hidden="true">
          {divider}
        </div>
      ) : null}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.to} className={styles.item}>
            <Link className={styles.itemLink} to={item.to} prefetch="intent">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {footer ? (
        <p className={styles.footer}>
          <Link className={styles.footerLink} to={footer.to}>
            {footer.label} <span aria-hidden="true">→</span>
          </Link>
        </p>
      ) : null}
    </section>
  );
};

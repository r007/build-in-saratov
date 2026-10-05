import { makeStyles } from '@griffel/react';
import { Link } from 'react-router';
import { color } from '../styles/tokens';

const useStyles = makeStyles({
  list: {
    maxWidth: 'var(--measure)',
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  item: {
    margin: 0,
    padding: '0.8rem 0',
    borderBottom: `1px solid ${color.placeholder}`,
  },
  title: {
    display: 'block',
    fontWeight: 700,
    ':hover': { textDecorationLine: 'underline' },
  },
  excerpt: {
    margin: '0.3rem 0 0',
    fontSize: '0.8rem',
  },
  mark: {
    padding: '0 0.1em',
    backgroundColor: '#ffef83',
    color: color.ink,
  },
});

/** A run of text, flagged when it is the part that matched. */
export interface TextRun {
  text: string;
  match: boolean;
}

export interface ResultListProps {
  items: ReadonlyArray<{ to: string; title: string; excerpt: readonly TextRun[] }>;
}

/** A list of linked results, each with an excerpt whose matches are marked. */
export const ResultList = ({ items }: ResultListProps) => {
  const styles = useStyles();

  return (
    <ol className={styles.list}>
      {items.map((item) => (
        <li key={item.to} className={styles.item}>
          <Link className={styles.title} to={item.to} prefetch="intent">
            {item.title}
          </Link>
          <p className={styles.excerpt}>
            {item.excerpt.map((run, index) =>
              run.match ? (
                <mark key={index} className={styles.mark}>
                  {run.text}
                </mark>
              ) : (
                run.text
              ),
            )}
          </p>
        </li>
      ))}
    </ol>
  );
};

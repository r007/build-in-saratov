import { makeStyles } from '@griffel/react';
import { useId } from 'react';
import { Form } from 'react-router';
import { color } from '../styles/tokens';
import { glyphs } from './glyphs';
import { Icon } from './Icon';

const useStyles = makeStyles({
  root: {
    borderTop: `2px solid ${color.sky}`,
    paddingTop: '0.3rem',
  },
  label: {
    display: 'block',
    margin: '0.3rem 0',
    fontSize: '0.7rem',
    letterSpacing: '0.05em',
  },
  row: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '0.4rem',
  },
  input: {
    flex: '1 1 auto',
    minWidth: 0,
    padding: '0.3em 0.5em',
    border: 0,
    borderRadius: 0,
    backgroundColor: color.sky,
    color: color.brandDark,
    fontSize: '0.7rem',
    letterSpacing: '0.03em',
    '::placeholder': { color: color.brandDark, opacity: 0.75 },
    ':focus': { backgroundColor: color.surface },
  },
  submit: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 0.2rem',
    border: 0,
    backgroundColor: 'transparent',
    color: color.sky,
    cursor: 'pointer',
    ':hover': { color: color.surface },
  },
});

export interface SearchFieldProps {
  /** Where the query is sent, as a GET request. */
  action: string;
  /** Name of the query parameter. */
  name: string;
  label: string;
  placeholder?: string;
  /** Accessible name of the submit button. */
  submitLabel: string;
  defaultValue?: string;
  /** Called on every keystroke, for search-as-you-type. */
  onValueChange?: (value: string) => void;
}

/**
 * A search form.
 *
 * It is a real GET form, so it works before scripts load and without them;
 * `onValueChange` is an enhancement on top, not the mechanism.
 */
export const SearchField = ({
  action,
  name,
  label,
  placeholder,
  submitLabel,
  defaultValue,
  onValueChange,
}: SearchFieldProps) => {
  const styles = useStyles();
  const id = useId();

  return (
    <Form className={styles.root} action={action} method="get" role="search">
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.row}>
        <input
          className={styles.input}
          id={id}
          type="search"
          name={name}
          placeholder={placeholder}
          defaultValue={defaultValue}
          autoComplete="off"
          enterKeyHint="search"
          onChange={
            onValueChange
              ? (event) => {
                  onValueChange(event.currentTarget.value);
                }
              : undefined
          }
        />
        <button className={styles.submit} type="submit" aria-label={submitLabel}>
          <Icon glyph={glyphs.search} size="1.1rem" />
        </button>
      </div>
    </Form>
  );
};

import { makeStyles, mergeClasses } from '@griffel/react';
import { useId, type HTMLInputAutoCompleteAttribute, type HTMLInputTypeAttribute } from 'react';
import { color } from '../styles/tokens';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    maxWidth: 'var(--measure)',
    marginBottom: '1rem',
  },
  label: {
    marginBottom: '0.4rem',
    color: color.inkMuted,
    fontSize: '0.75rem',
    lineHeight: 1.35,
  },
  control: {
    width: '100%',
    padding: '0.6rem 1rem',
    border: 0,
    borderBottom: `2px solid ${color.border}`,
    borderRadius: 0,
    backgroundColor: color.field,
    color: color.ink,
    fontSize: '0.875rem',
    lineHeight: 1.3,
    '::placeholder': { color: color.inkMuted, opacity: 1 },
    ':focus-visible': {
      outlineStyle: 'solid',
      outlineWidth: '3px',
      outlineColor: color.brand,
      outlineOffset: '-3px',
    },
  },
  multiline: {
    minHeight: '6rem',
    resize: 'vertical',
  },
  invalid: {
    borderBottomColor: color.danger,
    outlineStyle: 'solid',
    outlineWidth: '2px',
    outlineColor: color.danger,
    outlineOffset: '-2px',
  },
  error: {
    margin: '0.3rem 0 0',
    color: color.danger,
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
});

export interface TextFieldProps {
  label: string;
  name: string;
  type?: HTMLInputTypeAttribute;
  /** Render a multi-line `<textarea>` with this many rows. */
  rows?: number;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  /** A validation message. Its presence marks the field invalid. */
  error?: string;
}

/**
 * A labelled text input or textarea with an inline error.
 *
 * The label is always visible — a placeholder is a hint, not a name — and an
 * error is tied to the control, so a screen reader announces it with the field
 * rather than leaving the reader to find it.
 */
export const TextField = ({
  label,
  name,
  type = 'text',
  rows,
  required = false,
  placeholder,
  defaultValue,
  maxLength,
  autoComplete,
  error,
}: TextFieldProps) => {
  const styles = useStyles();
  const id = useId();
  const errorId = `${id}-error`;

  const shared = {
    id,
    name,
    required,
    placeholder,
    defaultValue,
    maxLength,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
  };

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {rows === undefined ? (
        <input
          {...shared}
          className={mergeClasses(styles.control, error && styles.invalid)}
          type={type}
        />
      ) : (
        <textarea
          {...shared}
          className={mergeClasses(styles.control, styles.multiline, error && styles.invalid)}
          rows={rows}
        />
      )}
      {error ? (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
};

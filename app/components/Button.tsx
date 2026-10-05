import { makeStyles, mergeClasses } from '@griffel/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { color } from '../styles/tokens';

const useStyles = makeStyles({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    padding: '0.9em 1.8em',
    border: '2px solid transparent',
    borderRadius: 0,
    fontSize: '0.7rem',
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: '0.025em',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transitionProperty: 'background-color, color',
    transitionDuration: '250ms',
    ':disabled': { opacity: 0.6, cursor: 'progress' },
    '@media (max-width: 600px)': { fontSize: '0.9rem' },
  },
  primary: {
    backgroundColor: color.brand,
    color: color.surface,
    ':hover': { backgroundColor: color.brandDark },
  },
  outline: {
    backgroundColor: 'transparent',
    borderTopColor: color.brand,
    borderRightColor: color.brand,
    borderBottomColor: color.brand,
    borderLeftColor: color.brand,
    color: color.brand,
    ':hover': { backgroundColor: color.brand, color: color.surface },
  },
  fullWidth: {
    display: 'flex',
    width: '100%',
  },
});

interface BaseProps {
  appearance?: 'primary' | 'outline';
  fullWidth?: boolean;
  children: ReactNode;
}

interface AsLink extends BaseProps {
  /** Render a link styled as a button. */
  to: string;
  type?: never;
  disabled?: never;
}

interface AsButton extends BaseProps {
  to?: undefined;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export type ButtonProps = AsLink | AsButton;

/** A button, or a link that looks like one when given `to`. */
export const Button = ({
  appearance = 'primary',
  fullWidth = false,
  children,
  ...rest
}: ButtonProps) => {
  const styles = useStyles();
  const className = mergeClasses(styles.root, styles[appearance], fullWidth && styles.fullWidth);

  if (rest.to !== undefined) {
    return (
      <Link className={className} to={rest.to}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type={rest.type ?? 'button'} disabled={rest.disabled}>
      {children}
    </button>
  );
};

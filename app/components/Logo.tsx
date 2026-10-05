import { makeStyles } from '@griffel/react';
import { Link } from 'react-router';

const useStyles = makeStyles({
  link: {
    display: 'inline-block',
  },
  image: {
    display: 'block',
    width: 'auto',
  },
});

export interface LogoProps {
  src: string;
  /** The name the mark stands for; read out in place of the image. */
  alt: string;
  /** Rendered height, as any CSS length. The width follows the artwork. */
  height: string;
  /** Link the logo, typically to the home page. */
  to?: string;
  /** Tooltip for the link. */
  hint?: string;
}

/** A brand mark, optionally linked. */
export const Logo = ({ src, alt, height, to, hint }: LogoProps) => {
  const styles = useStyles();
  const image = <img className={styles.image} src={src} alt={alt} style={{ height }} />;

  return to === undefined ? (
    image
  ) : (
    <Link className={styles.link} to={to} title={hint}>
      {image}
    </Link>
  );
};

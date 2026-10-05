import { makeStyles } from '@griffel/react';
import type { Picture } from '~/content/types';
import { color } from '../styles/tokens';
import { Image } from './Image';

const useStyles = makeStyles({
  root: {
    margin: 0,
    padding: 0,
    backgroundColor: color.placeholder,
  },
  image: {
    display: 'block',
    width: '100%',
    // Never taller than most of the screen, so the text below stays in reach.
    maxHeight: '70vh',
    objectFit: 'cover',
  },
});

export interface FullBleedImageProps {
  source: Picture;
  alt: string;
}

/** An image spanning the full width of the content area, cropped to fit. */
export const FullBleedImage = ({ source, alt }: FullBleedImageProps) => {
  const styles = useStyles();

  return (
    <figure className={styles.root}>
      <Image className={styles.image} source={source} alt={alt} sizes="100vw" priority />
    </figure>
  );
};

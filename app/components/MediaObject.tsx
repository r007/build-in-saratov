import { makeStyles } from '@griffel/react';
import type { ReactNode } from 'react';
import type { Picture } from '~/content/types';
import { media } from '../styles/tokens';
import { Image } from './Image';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '15px',
    [media.phone]: { flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
  },
  image: {
    flexShrink: 0,
    width: '80px',
    height: '80px',
    borderRadius: '100%',
    objectFit: 'cover',
  },
  title: {
    margin: '8px 0 2px',
    fontSize: '1rem',
  },
  body: {
    '& p': { margin: 0 },
    [media.abovePhone]: { fontSize: '0.7rem' },
  },
});

export interface MediaObjectProps {
  title: string;
  image?: Picture;
  imageAlt?: string;
  headingLevel?: 2 | 3 | 4;
  children?: ReactNode;
}

/** A round image beside a title and some text. */
export const MediaObject = ({
  title,
  image,
  imageAlt = '',
  headingLevel = 2,
  children,
}: MediaObjectProps) => {
  const styles = useStyles();
  const Heading = `h${headingLevel}` as const;

  return (
    <div className={styles.root}>
      {image ? <Image className={styles.image} source={image} alt={imageAlt} sizes="80px" /> : null}
      <div>
        <Heading className={styles.title}>{title}</Heading>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

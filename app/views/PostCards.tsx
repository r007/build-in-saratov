import { Card } from '~/components/Card';
import { CardGrid } from '~/components/CardGrid';
import type { PostSummary } from '~/content/posts.server';

/** Every sixth card, starting with the first, is given a full row. */
const FEATURE_EVERY = 6;

export interface PostCardsProps {
  posts: PostSummary[];
  /** Give some cards a full row to break up a long list. */
  highlight?: boolean;
  headingLevel?: 2 | 3;
}

/** Maps posts onto generic cards: the one place that knows a card shows a post. */
export const PostCards = ({ posts, highlight = false, headingLevel = 2 }: PostCardsProps) => (
  <CardGrid>
    {posts.map((post, index) => (
      <Card
        key={post.slug}
        to={`/${post.slug}/`}
        title={post.title}
        eyebrow={post.tags[0]?.name}
        description={post.excerpt}
        image={post.cover}
        featured={highlight && index % FEATURE_EVERY === 0}
        headingLevel={headingLevel}
      />
    ))}
  </CardGrid>
);

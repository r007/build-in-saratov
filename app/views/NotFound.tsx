import backgroundUrl from '~/assets/funny.gif';
import { Banner } from '~/components/Banner';
import { DisplayText } from '~/components/DisplayText';
import { Section } from '~/components/Section';
import type { PostSummary } from '~/content/posts.server';
import { PostCards } from './PostCards';

export interface NotFoundProps {
  /** A few posts to offer instead of a dead end. */
  suggestions: PostSummary[];
}

/** The 404 page. Rendered by any route that could not find what was asked for. */
export const NotFound = ({ suggestions }: NotFoundProps) => (
  <>
    <Banner
      size="screen"
      lead={<DisplayText>404</DisplayText>}
      title="Страница не найдена"
      backgroundImage={backgroundUrl}
    >
      <p>
        <a href="/">Перейти на главную страницу →</a>
      </p>
    </Banner>
    <Section grow label="Последние статьи">
      <PostCards posts={suggestions} />
    </Section>
  </>
);

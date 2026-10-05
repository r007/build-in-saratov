import { Banner } from '~/components/Banner';
import { Section } from '~/components/Section';
import { listPosts } from '~/content/posts.server';
import { pageMeta } from '~/seo';
import { PostCards } from '~/views/PostCards';
import type { Route } from './+types/articles';

export const loader = async () => ({ posts: await listPosts() });

export const meta: Route.MetaFunction = () =>
  pageMeta({ title: 'Последние записи в блоге', path: '/articles/' });

export default function Articles({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Banner title="Статьи" />
      <Section grow label="Все статьи">
        <PostCards posts={loaderData.posts} highlight />
      </Section>
    </>
  );
}

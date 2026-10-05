import { data } from 'react-router';
import { Banner } from '~/components/Banner';
import { Section } from '~/components/Section';
import { getTag, listPosts } from '~/content/posts.server';
import { plural } from '~/plural';
import { pageMeta } from '~/seo';
import { NotFound } from '~/views/NotFound';
import { PostCards } from '~/views/PostCards';
import type { Route } from './+types/tag';

const SUGGESTIONS = 3;

export const loader = async ({ params }: Route.LoaderArgs) => {
  const tag = await getTag(params.tag);
  if (!tag) {
    return data(
      { tag: undefined, posts: await listPosts({ limit: SUGGESTIONS }) },
      { status: 404 },
    );
  }

  return { tag, posts: await listPosts({ tag: tag.slug }) };
};

export const meta: Route.MetaFunction = ({ loaderData: loaded }) =>
  loaded?.tag
    ? pageMeta({
        title: loaded.tag.name,
        description: loaded.tag.description,
        path: `/tags/${loaded.tag.slug}/`,
      })
    : pageMeta({ title: 'Страница не найдена', path: '/', index: false });

export default function TagPage({ loaderData }: Route.ComponentProps) {
  const { tag, posts } = loaderData;
  if (!tag) return <NotFound suggestions={posts} />;

  const count = posts.length;

  return (
    <>
      <Banner
        eyebrow={tag.name}
        title={
          tag.description ??
          `Коллекция из ${count} ${plural(count, 'записи', 'записей', 'записей')}`
        }
      />
      <Section grow label={`Статьи с меткой «${tag.name}»`}>
        <PostCards posts={posts} highlight />
      </Section>
    </>
  );
}

import { data, Link } from 'react-router';
import { Banner } from '~/components/Banner';
import { Card } from '~/components/Card';
import { CardGrid } from '~/components/CardGrid';
import { FullBleedImage } from '~/components/FullBleedImage';
import { glyphs } from '~/components/glyphs';
import { Icon } from '~/components/Icon';
import { IconLinkList } from '~/components/IconLinkList';
import { LinkPanel } from '~/components/LinkPanel';
import { MediaObject } from '~/components/MediaObject';
import { Prose } from '~/components/Prose';
import { Section } from '~/components/Section';
import { getPostPage, listPosts, type PostSummary } from '~/content/posts.server';
import { plural } from '~/plural';
import { pageMeta } from '~/seo';
import { absoluteUrl, site } from '~/site';
import { NotFound } from '~/views/NotFound';
import type { Route } from './+types/post';

const SUGGESTIONS = 3;

export const loader = async ({ params }: Route.LoaderArgs) => {
  const page = await getPostPage(params.slug);

  // Any single-segment URL lands here, so an unknown one is an ordinary 404.
  if (!page) {
    return data(
      { page: undefined, suggestions: await listPosts({ limit: SUGGESTIONS }) },
      { status: 404 },
    );
  }

  return { page, suggestions: [] };
};

export const meta: Route.MetaFunction = ({ loaderData: loaded }) =>
  loaded?.page
    ? pageMeta({
        title: loaded.page.post.title,
        description: loaded.page.post.excerpt,
        path: `/${loaded.page.post.slug}/`,
        image: loaded.page.post.cover?.social,
        type: 'article',
      })
    : pageMeta({ title: 'Страница не найдена', path: '/', index: false });

/** Links that hand this page to a network's own share dialog. No scripts. */
const shareLinks = (url: string, title: string) => {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  return [
    { label: 'Поделиться Вконтакте', glyph: glyphs.vk, href: `https://vk.com/share.php?url=${u}` },
    {
      label: 'Поделиться в Facebook',
      glyph: glyphs.facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
    {
      label: 'Поделиться в Twitter',
      glyph: glyphs.twitter,
      href: `https://twitter.com/intent/tweet?text=${t}&url=${u}&via=${site.twitter}`,
    },
    {
      label: 'Опубликовать в Pinterest',
      glyph: glyphs.pinterest,
      href: `https://pinterest.com/pin/create/link/?url=${u}`,
    },
    { label: 'Отправить по почте', glyph: glyphs.email, href: `mailto:?subject=${t}&body=${u}` },
  ];
};

const NeighbourCard = ({ post }: { post: PostSummary }) => (
  <Card
    to={`/${post.slug}/`}
    title={post.title}
    eyebrow={post.tags[0]?.name}
    description={post.excerpt}
    image={post.cover}
  />
);

export default function PostPage({ loaderData }: Route.ComponentProps) {
  const { page, suggestions } = loaderData;
  if (!page) return <NotFound suggestions={suggestions} />;

  const { post, author, older, newer, related } = page;
  const [tag] = post.tags;

  return (
    <>
      <article>
        <Banner
          title={post.title}
          eyebrow={
            <>
              <time dateTime={post.date}>{post.dateLabel}</time>
              {tag ? (
                <>
                  {' / '}
                  <Link to={`/tags/${tag.slug}/`}>{tag.name}</Link>
                </>
              ) : null}
            </>
          }
        />

        {post.cover ? <FullBleedImage source={post.cover} alt="" /> : null}

        <Section>
          <Prose html={post.html} zoomSelector="img[data-zoomable]" />
          <IconLinkList
            heading="Поделитесь этой записью:"
            items={shareLinks(absoluteUrl(`/${post.slug}/`), post.title)}
            headingLevel={2}
          />
        </Section>

        {author ? (
          <Section as="footer">
            <MediaObject title={author.name} image={author.avatar} headingLevel={2}>
              <p>{author.bio}</p>
            </MediaObject>
          </Section>
        ) : null}
      </article>

      <Section as="aside" grow label="Читайте также">
        <CardGrid>
          {related && related.posts.length > 0 ? (
            <LinkPanel
              eyebrow="Категория"
              title={related.tag.name}
              titleTo={`/tags/${related.tag.slug}/`}
              divider={<Icon glyph={glyphs.infinity} size="40px" />}
              items={related.posts.map((other) => ({ to: `/${other.slug}/`, label: other.title }))}
              footer={{
                to: `/tags/${related.tag.slug}/`,
                label: `Все ${related.total} ${plural(related.total, 'запись', 'записи', 'записей')}`,
              }}
            />
          ) : null}
          {older ? <NeighbourCard post={older} /> : null}
          {newer ? <NeighbourCard post={newer} /> : null}
        </CardGrid>
      </Section>
    </>
  );
}

import logoUrl from '~/assets/logo.svg';
import { Banner } from '~/components/Banner';
import { Feature, FeatureGrid } from '~/components/Feature';
import { glyphs } from '~/components/glyphs';
import { Logo } from '~/components/Logo';
import { ScrollCue } from '~/components/ScrollCue';
import { Section } from '~/components/Section';
import { SectionHeader } from '~/components/SectionHeader';
import { getImage, listPosts } from '~/content/posts.server';
import { pageMeta } from '~/seo';
import { site } from '~/site';
import { PostCards } from '~/views/PostCards';
import type { Route } from './+types/home';

const LATEST_POSTS = 4;
const SERVICES_ID = 'services';

const services = [
  {
    glyph: glyphs.rocket,
    title: 'Ускорение сайта',
    description: 'Ведь не только Red Bull окрыляет, но и прямые руки веб-разработчика',
  },
  {
    glyph: glyphs.binoculars,
    title: 'Консультации',
    description: 'Не разбираетесь в программировании? Лучше спросите у профессионала',
  },
  {
    glyph: glyphs.wrench,
    title: 'Доработки',
    description: 'Изменения в готовом сайте, исправление ошибок, написание плагинов',
  },
  {
    glyph: glyphs.send,
    title: 'Создание',
    description: 'Проектирование сайта с нуля специально под заказчика',
  },
];

export const loader = async () => {
  const [posts, cover] = await Promise.all([
    listPosts({ limit: LATEST_POSTS }),
    getImage('home-cover.png'),
  ]);

  return { posts, socialImage: cover?.social };
};

export const meta: Route.MetaFunction = ({ loaderData: data }) =>
  pageMeta({
    title: 'Домашняя страница',
    description: site.description,
    path: '/',
    image: data?.socialImage,
  });

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Banner
        size="screen"
        lead={<Logo src={logoUrl} alt={site.name} height="100px" />}
        title={site.tagline}
      >
        <ScrollCue href={`#${SERVICES_ID}`} label="Прокрутить к содержимому" />
      </Banner>

      <Section>
        <div id={SERVICES_ID}>
          <SectionHeader title="Оказываю услуги" />
        </div>
        <FeatureGrid>
          {services.map((service) => (
            <Feature key={service.title} to="/contact/" {...service} />
          ))}
        </FeatureGrid>
      </Section>

      <Section grow>
        <SectionHeader
          title="Пишу заметки"
          description="Подробные статьи, уроки. Здесь я делюсь мыслями о веб-разработке, современных JavaScript фреймворках, CMS и интернет-магазинах."
          action={{ to: '/articles/', label: 'Все статьи' }}
        />
        <PostCards posts={loaderData.posts} highlight headingLevel={3} />
      </Section>
    </>
  );
}

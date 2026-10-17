import { Banner } from '~/components/Banner';
import { Image } from '~/components/Image';
import { Section } from '~/components/Section';
import { getImage } from '~/content/posts.server';
import { pageMeta } from '~/seo';
import { site } from '~/site';
import type { Route } from './+types/about';

export const loader = async () => {
  const [cover, amsterdam] = await Promise.all([
    getImage('about-cover.png'),
    getImage('build-in-amsterdam.jpg'),
  ]);

  return { socialImage: cover?.social, amsterdam };
};

export const meta: Route.MetaFunction = ({ loaderData: data }) =>
  pageMeta({
    title: 'Информация о сайте',
    description: site.description,
    path: '/about/',
    image: data?.socialImage,
  });

const external = { target: '_blank', rel: 'noreferrer noopener' } as const;

export default function About({ loaderData }: Route.ComponentProps) {
  const { amsterdam } = loaderData;

  return (
    <article>
      <Banner title={site.name} />
      <Section grow>
        <div className="prose">
          <p>
            У нас принято ругать всё русское и ставить в пример Европу, Америку, Австралию. Но здесь
            тоже живут и работают люди. Мы тоже делаем классные вещи, пускай даже Саратов не самый
            лучший город на земле. Но даже здесь есть свои специалисты и инженеры.
          </p>
          <p>
            Идея названия «Build in Saratov» родилась неслучайно. Оно взято по аналогии с командой{' '}
            <a
              {...external}
              title="Сайт агенства Build in Amsterdam"
              href="https://www.buildinamsterdam.com/"
            >
              Build in Amsterdam
            </a>
            , создавших знаменитый магазин{' '}
            <a {...external} href="https://www.mendo.nl/">
              Mendo
            </a>
            . Этот магазин получил награду «<i>сайт года</i>» по версии awwwards.
          </p>
          {amsterdam ? (
            <figure>
              <Image source={amsterdam} alt="Сайт команды Build in Amsterdam" />
              <figcaption>
                Сайт агенства <i>Build in Amsterdam</i>
              </figcaption>
            </figure>
          ) : null}

          <h2>Окей! Продолжай, я заинтригован</h2>
          <p>
            Долгое время я отвечал на анонимном форуме, вконтакте. Помогал людям с веб-разработкой,
            советовал хостинги, движки интернет-магазинов, исправлял баги. Со временем накопилась
            критическая масса знаний и я подумал «почему бы не перебраться в свой собственный блог?»
          </p>
          <p>
            Целью было не столько самопиар или желание заработать, сколько стремление поделиться
            опытом. Когда отвечаешь на один и тот же вопрос в 10-ый раз, поневоле хочется написать
            статью и давать ссылки на неё.
          </p>
          <p>Сказано – сделано. И вот, где-то за пару недель родился этот сайт.</p>

          <h2>Философия сайта</h2>
          <p>
            Дизайн – не искусство. Картину можно повесить на стену и восхищаться, размышлять или
            ненавидеть. А дизайн – это функция. Он помогает найти информацию или совершить какое-то
            действие (купить продукт например). В этом и отличие, дизайн это отражение аудитории
            сайта, а искусство это отражение самого художника.
          </p>
          <p>
            Самый лучший дизайн – невидимый. Поэтому у этого сайта практически отсутствует
            оформление, он намеренной голый и минималистичный. Я не стал загромождать сайт, а
            позволил содержанию говорить самому за себя.
          </p>

          <h2>На чем сделан этот сайт?</h2>
          <p>
            Сайт построен на React и{' '}
            <a {...external} href="https://reactrouter.com/">
              React Router
            </a>
            . Страницы формируются на сервере с помощью AWS Lambda@Edge и кешируются в CloudFront.
            Готовые страницы, изображения и скрипты загружаются с ближайшего доступного узла сети
            доставки контента.
          </p>
          <p>
            Статьи хранятся в Markdown, без базы данных. При сборке Vite обрабатывает текст,
            добавляет подсветку кода и подготавливает изображения в формате WebP для разных экранов.
            Поиск работает по содержимому статей, а сообщения из формы обратной связи отправляются
            через Amazon SES.
          </p>

          <p>Технологии:</p>
          <ul>
            <li>
              React 19 и{' '}
              <a {...external} href="https://reactrouter.com/">
                React Router 8
              </a>
            </li>
            <li>TypeScript и Vite</li>
            <li>Стили на Griffel и CSS</li>
            <li>
              AWS:{' '}
              <a {...external} href="https://aws.amazon.com/cloudfront/">
                CloudFront
              </a>
              , Lambda@Edge и S3
            </li>
            <li>Статьи в Markdown, подсветка кода Shiki и изображения WebP</li>
            <li>Поиск MiniSearch и отправка почты через Amazon SES</li>
          </ul>
        </div>
      </Section>
    </article>
  );
}

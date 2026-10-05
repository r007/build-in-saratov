import { Banner } from '~/components/Banner';
import { Image } from '~/components/Image';
import { Section } from '~/components/Section';
import { getImage } from '~/content/posts.server';
import { pageMeta } from '~/seo';
import { site } from '~/site';
import type { Route } from './+types/about';

export const loader = async () => {
  const [cover, amsterdam, pageSpeed] = await Promise.all([
    getImage('about-cover.png'),
    getImage('build-in-amsterdam.jpg'),
    getImage('pagespeed.png'),
  ]);

  return { socialImage: cover?.social, amsterdam, pageSpeed };
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
  const { amsterdam, pageSpeed } = loaderData;

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
            Весь сайт полностью статичный, построенный на базе прекрасного фреймворка{' '}
            <a {...external} href="https://www.gatsbyjs.org/">
              Gatsby
            </a>
            . Основные преимущества такого подхода в безопасности и скорости. В отличии от
            динамических вебсайтов, тут не нужна база данных. А значит, не нужно ничего защищать от
            хакеров. А значит, не нужно кеширование.
          </p>
          <p>
            На данный момент, сайт набирает <strong>100 баллов из 100</strong> (по версии Google
            PageSpeed Insights) на всех страницах. То есть, загрузка происходит молниеносно.
          </p>
          {pageSpeed ? (
            <figure>
              <Image source={pageSpeed} alt="Отчет по скорости загрузки сайта PageSpeed Insights" />
              <figcaption>Отчет по скорости загрузки сайта PageSpeed Insights</figcaption>
            </figure>
          ) : null}

          <p>Технологии:</p>
          <ul>
            <li>
              Генератор статических сайтов{' '}
              <a {...external} href="https://www.gatsbyjs.org/">
                Gatsby
              </a>
            </li>
            <li>
              Хостинг{' '}
              <a {...external} href="https://aws.amazon.com/ru/amplify/">
                AWS Amplify
              </a>
            </li>
            <li>Все записи в Markdown</li>
            <li>GraphQL для запросов</li>
          </ul>
        </div>
      </Section>
    </article>
  );
}

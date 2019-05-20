import * as React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import IndexLayout from '../layouts';
import Wrapper from '../components/Wrapper';
import SiteNav from '../components/header/SiteNav';

import { PageTitle } from '../styles/shared';
import { PostFullContent } from '../components/PostContent';
import PostHeader from '../components/PostHeader';
import SEO from '../components/SEO';

const About = ({ data }) => {
  return (
    <IndexLayout>
      <SEO
        title="Информация о сайте"
        description="Блог веб-разработчика. Всё, что интересует людей, ответы на часто задаваемые вопросы, советы, обзоры. Рассказываю о последних трендах в сайтостроении."
        image={
          data.CoverImage
            ? data.site.siteMetadata.siteUrl + data.CoverImage.childImageSharp.fluid.src
            : ''
        }
      />
      <SiteNav />
      <Wrapper>
        <main id="content">
          <PostHeader>
            <header>
              <PageTitle>Сделано в Саратове</PageTitle>
            </header>
          </PostHeader>

          <PostFullContent>
            <p>
              У нас принято ругать всё русское и ставить в пример Европу, Америку, Австралию. Но
              здесь тоже живут и работают люди. Мы тоже делаем классные вещи, пускай даже Саратов не
              самый лучший город на земле. Но даже здесь есть свои специалисты и инженеры.
            </p>
            <p>
              Идея названия «Build in Saratov» родилась неслучайно. Оно взято по аналогии с командой{' '}
              <a
                target="_blank"
                rel="noreferrer noopener"
                title="Сайт агенства Build in Amsterdam"
                href="https://www.buildinamsterdam.com/"
              >
                Build in Amsterdam
              </a>{' '}
              , создавших знаменитый магазин{' '}
              <a target="_blank" rel="noreferrer noopener" href="https://www.mendo.nl/">
                Mendo
              </a>
              . Этот магазин получил награду «<i>сайт года</i>» по версии awwwards.
            </p>
            <p>
              {data.BuildInAmsterdam && (
                <figure>
                  <Img
                    fluid={data.BuildInAmsterdam.childImageSharp.fluid}
                    alt="Сайт команды Build in Amsterdam"
                  />
                  <figcaption>
                    Сайт агенства <i>Build in Amsterdam</i>
                  </figcaption>
                </figure>
              )}
            </p>
            <h2>Окей! Продолжай, я заинтригован</h2>
            <p>
              Долгое время я отвечал на анонимном форуме, вконтакте. Помогал людям с
              веб-разработкой, советовал хостинги, движки интернет-магазинов, исправлял баги. Со
              временем накопилась критическая масса знаний и я подумал «почему бы не перебраться в
              свой собственный блог?»
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
              ненавидеть. А дизайн – это функция. Он помогает найти информацию или совершить
              какое-то действие (купить продукт например). В этом и отличие, дизайн это отражение
              аудитории сайта, а искусство это отражение самого художника.
            </p>
            <p>
              Самый лучший дизайн – невидимый. Поэтому у этого сайта практически отсутствует
              оформление, он намеренной голый и минималистичный. Я не стал загромождать сайт, а
              позволил содержанию говорить самому за себя.
            </p>

            <h2>На чем сделан этот сайт?</h2>
            <p>
              Весь сайт полностью статичный, построенный на базе прекрасного фреймворка{' '}
              <a target="_blank" rel="noreferrer noopener" href="https://www.gatsbyjs.org/">
                Gatsby
              </a>
              . Основные преимущества такого подхода в безопасности и скорости. В отличии от
              динамических вебсайтов, тут не нужна база данных. А значит, не нужно ничего защищать
              от хакеров. А значит, не нужно кеширование.
            </p>
            <p>
              На данный момент, сайт набирает <strong>100 баллов из 100</strong> (по версии Google
              PageSpeed Insights) на всех страницах. То есть, загрузка происходит молниеносно.
              {data.PageSpeed && (
                <figure>
                  <Img
                    fluid={data.PageSpeed.childImageSharp.fluid}
                    alt="Отчет по скорости загрузки сайта PageSpeed Insights"
                  />
                  <figcaption>Отчет по скорости загрузки сайта PageSpeed Insights</figcaption>
                </figure>
              )}
            </p>
            <p>Технологии:</p>
            <ul>
              <li>
                Генератор статических сайтов{' '}
                <a target="_blank" rel="noreferrer noopener" href="https://www.gatsbyjs.org/">
                  Gatsby
                </a>
              </li>
              <li>
                Хостинг{' '}
                <a
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://aws.amazon.com/ru/amplify/"
                >
                  AWS Amplify
                </a>
              </li>
              <li>Все записи в Markdown</li>
              <li>GraphQL для запросов</li>
            </ul>
          </PostFullContent>
        </main>
      </Wrapper>
    </IndexLayout>
  );
};

export default About;

export const query = graphql`
  query AboutPage {
    site {
      siteMetadata {
        siteUrl
      }
    }

    CoverImage: file(relativePath: { eq: "img/about-cover.png" }) {
      childImageSharp {
        fluid(quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }

    BuildInAmsterdam: file(relativePath: { eq: "img/build-in-amsterdam.jpg" }) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 1200) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }

    PageSpeed: file(relativePath: { eq: "img/pagespeed.png" }) {
      childImageSharp {
        fluid(quality: 90, maxWidth: 1200) {
          ...GatsbyImageSharpFluid_withWebp
        }
      }
    }
  }
`;

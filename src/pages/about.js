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
        image={data.CoverImage ? data.CoverImage.childImageSharp.fluid.src : ''}
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
              самый лучший город на земле. Но даже здесь есть свои специалисты и инженеры. Идея
              названия <code>«Build in Saratov»</code> родилась неслучайно. Оно взято по аналогии с
              командой{' '}
              <a target="_blank" rel="noreferrer noopener" href="https://www.buildinamsterdam.com/">
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
              свой собственный блог?». Целью было не столько самопиар или желание заработать,
              сколько стремление поделиться опытом. Когда отвечаешь на один и тот же вопрос в 10-ый
              раз, поневоле хочется написать статью и давать всем ссылки на неё.
            </p>

            <p>Сказано – сделано. И вот, где-то за пару недель родился этот сайт.</p>
          </PostFullContent>
        </main>
      </Wrapper>
    </IndexLayout>
  );
};

export default About;

export const query = graphql`
  query {
    CoverImage: file(relativePath: { eq: "img/about-cover1.png" }) {
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
  }
`;

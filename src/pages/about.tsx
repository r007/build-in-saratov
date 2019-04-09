import IndexLayout from '../layouts';
import Wrapper from '../components/Wrapper';
import SiteNav from '../components/header/SiteNav';
import * as React from 'react';

import { PostFullHeader, PostFullTitle } from '../templates/post';
import { PostFullContent } from '../components/PostContent';
import Helmet from 'react-helmet';

const About: React.FunctionComponent = () => (
  <IndexLayout>
    <Helmet>
      <title>About</title>
    </Helmet>
    <SiteNav />
    <Wrapper>
      <main id="content">
        <PostFullHeader>
          <header>
            <PostFullTitle>Сделано в Саратове</PostFullTitle>
          </header>
        </PostFullHeader>

        <PostFullContent>
          <p>
            У нас принято ругать всё русское и ставить в пример Европу, Америку, Австралию.
            Забывая при этом, что здесь тоже живут и работают люди. И мы тоже делаем классные вещи (иногда).
            Да, Саратов не самый лучший город на земле. Он просто один из многих –
            грязный, бедный, депрессивный. Но даже здесь есть своя интеллигенция, специалисты, инженеры...
            Не всё ещё пропито. Я назвал сайт «Сделано в Саратове», чтобы показать, что мы ещё
            не разучились делать хорошие вещи.
          </p>
          <p>
            Сама идея сайта родилась после того, как я долгое время отвечал на анонимном форуме, вконтакте.
            Помогал людям с веб-разработкой, советовал хостинги, движки интернет-магазинов, фиксил баги. Со
            временем накопилась критическая масса знаний и я подумал «почему бы не перебраться в свой собственный
            блог?» Тем более, это же типа моя фишка. Сказано – сделано. И вот, где-то за неделю родился этот сайт.
          </p>
        </PostFullContent>
      </main>
    </Wrapper>
  </IndexLayout>
);

export default About;

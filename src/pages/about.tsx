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
            Не всё ещё пропито. Я назвал сайт "Сделано в Саратове", чтобы показать, что мы ещё
            не разучились делать хорошие вещи.
          </p>
          <p>
            Vestibulum semper pretium ipsum nec congue. Ut ac eros nisi. Donec leo sem, aliquam
            mollis sapien ultrices, dapibus congue diam. Proin viverra dapibus blandit. Ut
            mauris tellus, tristique id felis vel, venenatis vestibulum nunc. Nam molestie
            pulvinar nibh, eget egestas augue. Maecenas tellus arcu, mattis ut ipsum non,
            sollicitudin convallis nunc. Donec nec neque tristique, aliquet lacus id, laoreet
            nunc. Cras dapibus nisi nulla, ullamcorper faucibus neque suscipit ac. Donec eget
            orci venenatis justo lobortis volutpat. Proin vel placerat nisl. Integer arcu nunc,
            sodales eu fringilla non, aliquam non diam. Cras placerat, massa et faucibus
            pretium, ante elit tincidunt tellus, tristique ultricies velit quam et massa.
          </p>
          <p>
            In nunc lacus, dapibus vitae lacus sit amet, efficitur iaculis neque. Suspendisse ut
            tellus quis leo vestibulum tincidunt. Aenean nec enim ac dolor lacinia semper. Ut
            sed laoreet libero. Nunc elementum sollicitudin accumsan. Nunc eu augue neque. Proin
            a tortor nibh. Cras eu nisl ornare sapien feugiat pellentesque. Mauris dignissim vel
            quam eu pellentesque. Integer sit amet posuere quam, eu ullamcorper odio. Nullam a
            lacus tempus sapien dignissim ullamcorper. In hac habitasse platea dictumst. Proin
            quis massa aliquam, feugiat tortor sit amet, tincidunt urna. Donec posuere pulvinar
            lectus, ac semper ipsum vulputate quis.
          </p>
        </PostFullContent>
      </main>
    </Wrapper>
  </IndexLayout>
);

export default About;

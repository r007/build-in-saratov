import * as React from 'react';
import Helmet from 'react-helmet';
import IndexLayout from '../layouts';
import Wrapper from '../components/Wrapper';
import SiteNav from '../components/header/SiteNav';
import ContactForm from '../components/ContactForm';

import { PostFullTitle } from '../templates/post';
import { PostFullContent } from '../components/PostContent';
import PostHeader from '../components/PostHeader';

const Contact = () => {
  return (
    <IndexLayout>
      <Helmet>
        <title>Обратная связь</title>
      </Helmet>
      <SiteNav />
      <Wrapper>
        <main id="content">
          <PostHeader>
            <header>
              <PostFullTitle>Обратная связь</PostFullTitle>
            </header>
          </PostHeader>

          <PostFullContent>
            <ContactForm />
          </PostFullContent>
        </main>
      </Wrapper>
    </IndexLayout>
  );
};

export default Contact;

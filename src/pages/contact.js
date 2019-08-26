import * as React from 'react';
import Helmet from 'react-helmet';
import IndexLayout from '../layouts';
import ContactForm from '../components/ContactForm';

import { PageTitle } from '../styles/shared';
import { PostFullContent } from '../components/PostContent';
import PostHeader from '../components/PostHeader';

const Contact = () => {
  return (
    <IndexLayout>
      <Helmet>
        <title>Обратная связь</title>
      </Helmet>
      <main id="content">
        <PostHeader>
          <header>
            <PageTitle>Обратная связь</PageTitle>
          </header>
        </PostHeader>

        <section className="post-full-content">
          <PostFullContent>
            <ContactForm />
          </PostFullContent>
        </section>
      </main>
    </IndexLayout>
  );
};

export default Contact;

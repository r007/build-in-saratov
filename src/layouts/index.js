import * as React from 'react';
import Helmet from 'react-helmet';

import './style.css';

import styled from 'styled-components';
import { Hits, InstantSearch, connectStateResults } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';
import Wrapper from '../components/Wrapper';
import PostHeader from '../components/PostHeader';
import SiteNav from '../components/header/SiteNav';
import PostHit from '../components/search/hitComps';
import { PageTitle, PageDescription, HeaderLink } from '../styles/shared';
import favicon from '../favicon.ico';

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY,
);

const Results = connectStateResults(({ searchResults: res, children }) =>
  res && res.nbHits > 0 ? (
    children
  ) : (
    <React.Fragment>
      Ничего не найдено{' '}
      <span role="img" aria-label="Думает">
        🤔
      </span>
    </React.Fragment>
  ),
);

const HitsWrapper = styled(Hits)`
  > * + * {
    padding-top: 1em !important;
    border-top: 2px solid ${props => props.theme.darkGray};
  }

  li + li {
    margin-top: 0.7em;
    padding-top: 0.7em;
    border-top: 1px solid ${props => props.theme.lightGray};
  }

  * {
    margin-top: 0;
    padding: 0;
  }

  ul {
    list-style: none;
  }
`;

const IndexLayout = ({ className, children }) => {
  const Content = connectStateResults(({ searchState }) =>
    searchState && searchState.query ? (
      <React.Fragment>
        <PostHeader>
          <PageDescription>
            Поиск предоставлен{' '}
            <HeaderLink
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.algolia.com"
            >
              Algolia
            </HeaderLink>
          </PageDescription>
          <PageTitle>Результаты по запросу: {searchState.query}</PageTitle>
        </PostHeader>
        <section>
          <Results>
            <HitsWrapper hitComponent={PostHit} />
          </Results>
        </section>
      </React.Fragment>
    ) : (
      children
    ),
  );

  return (
    <div className={className}>
      <InstantSearch searchClient={searchClient} indexName="Posts">
        <Helmet>
          <link rel="icon" href={favicon} type="image/x-icon" />
        </Helmet>
        <SiteNav />
        <Wrapper>
          <Content />
        </Wrapper>
      </InstantSearch>
    </div>
  );
};

export default IndexLayout;

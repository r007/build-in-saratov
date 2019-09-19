import React from 'react';
import styled from 'styled-components';
import { Highlight, Snippet, connectHits } from 'react-instantsearch-dom';
import { Link } from 'gatsby';

const Header = styled(Link)`
  display: block;
  font-weight: bold;
`;

const PostHit = ({ hit }) => (
  <>
    <Header to={hit.fields.slug}>
      <Highlight attribute="title" hit={hit} tagName="mark" />
    </Header>
    <Snippet attribute="excerpt" hit={hit} tagName="mark" />
  </>
);

export default connectHits(PostHit);

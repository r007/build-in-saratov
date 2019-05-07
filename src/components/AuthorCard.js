import { Link } from 'gatsby';
import * as _ from 'lodash';
import * as React from 'react';
import Img from 'gatsby-image';
import styled from 'styled-components';

import colors from '../styles/colors';

const AuthorCardSection = styled.div`
  display: flex;
`;

const Avatar = styled(Img)`
  flex-shrink: 0;
  border-radius: 100%;
  margin-right: 15px;
`;

const AuthorCardName = styled.h4`
  margin: 8px 0 2px 0;
  padding: 0;
  font-size: 1rem;

  a {
    color: ${colors.darkgrey};
    font-weight: 700;
  }

  a:hover {
    text-decoration: none;
  }
`;

const AuthorCardContent = styled.div`
  p {
    font-size: 0.7rem;
    margin: 0;
    color: ${colors.midgrey};
    line-height: 1.3em;
  }
`;

const AuthorCard = ({ author }) => {
  return (
    <AuthorCardSection>
      {/* TODO: default avatar */}
      {/* TODO: author page url */}
      <Avatar
        fixed={author.avatar.children[0].fixed}
        objectFit="cover"
        objectPosition="50% 50%"
        alt={author.id}
      />
      <AuthorCardContent>
        <AuthorCardName>
          <Link to={`/author/${_.kebabCase(author.id)}/`}>{author.id}</Link>
        </AuthorCardName>
        {author.bio ? (
          <p>{author.bio}</p>
        ) : (
          <p>
            Read <Link to={`/author/${_.kebabCase(author.id)}/`}>more posts</Link> by this author.
          </p>
        )}
      </AuthorCardContent>
    </AuthorCardSection>
  );
};

export default AuthorCard;

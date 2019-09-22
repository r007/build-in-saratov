import { Link } from 'gatsby';
import * as _ from 'lodash';
import * as React from 'react';
import Img from 'gatsby-image';
import styled from 'styled-components';

import colors from '../styles/colors';
import Button from './Button';

const AuthorCardSection = styled.div`
  display: flex;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
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
  @media only screen and (max-width: 600px) {
    margin: 1rem;
    text-align: center;
  }

  p {
    margin: 0;

    @media only screen and (min-width: 601px) {
      font-size: 0.7rem;
    }
  }
`;

const AllPosts = styled.div`
  flex-shrink: 0;
  margin-left: 20px;
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

      <AllPosts>
        <Button rounded color="transparent" href={`/author/${_.kebabCase(author.id)}/`}>
          Все записи автора
        </Button>
      </AllPosts>
    </AuthorCardSection>
  );
};

export default AuthorCard;

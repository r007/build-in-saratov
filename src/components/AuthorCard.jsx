import { Link } from 'gatsby';
import * as _ from 'lodash';
import * as React from 'react';
import { GatsbyImage } from 'gatsby-plugin-image';
import styled from 'styled-components';

const AuthorCardSection = styled.div`
  display: flex;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Avatar = styled(GatsbyImage)`
  flex-shrink: 0;
  border-radius: 100%;
  margin-right: 15px;
  width: 80px;
  height: 80px;
`;

const AuthorCardName = styled.h4`
  margin: 8px 0 2px 0;
  padding: 0;
  font-size: 1rem;
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

const AuthorCard = ({ image, name, bio }) => (
  <AuthorCardSection>
    {/* TODO: default avatar */}
    {/* TODO: author page url */}
    <Avatar image={image} objectFit="cover" objectPosition="50% 50%" alt={name} />
    <AuthorCardContent>
      <AuthorCardName>{name}</AuthorCardName>
      {bio ? (
        <p>{bio}</p>
      ) : (
        <p>
          Read <Link to={`/author/${_.kebabCase(name)}/`}>more posts</Link> by this author.
        </p>
      )}
    </AuthorCardContent>
  </AuthorCardSection>
);

export default AuthorCard;

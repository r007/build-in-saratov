import { graphql, Link } from 'gatsby';
import * as React from 'react';
import styled from 'styled-components';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import PostHeader from '../components/PostHeader';
import IndexLayout from '../layouts';
import { PostFeed, PageTitle } from '../styles/shared';
// Import background image
import BackgroundImage from '../content/img/funny.gif';

const ErrorCode = styled.h1`
  margin: 0;
  font-size: 12vw;
  line-height: 1em;
  letter-spacing: -5px;
`;

const ErrorLink = styled(Link)`
  color: #fff;
  display: inline-block;
  margin-top: 5px;
`;

const ErrorWrapper = styled(PostHeader)`
  background: #164194 center / contain no-repeat url(${BackgroundImage});
`;

const NotFoundPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark;

  return (
    <IndexLayout>
      <SiteNav />
      <Wrapper>
        <ErrorWrapper fullHeight>
          <ErrorCode>404</ErrorCode>
          <PageTitle>Страница не найдена</PageTitle>
          <ErrorLink to="">Перейти на главную страницу →</ErrorLink>
        </ErrorWrapper>
        <section>
          <PostFeed>
            {edges.map(({ node }) => (
              <PostCard key={node.fields.slug} post={node} />
            ))}
          </PostFeed>
        </section>
      </Wrapper>
    </IndexLayout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query NotFoundPage {
    allMarkdownRemark(limit: 3, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          timeToRead
          frontmatter {
            title
            date
            tags
            image {
              childImageSharp {
                fluid(maxWidth: 3720) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            author {
              id
              bio
              avatar {
                children {
                  ... on ImageSharp {
                    fixed(quality: 90) {
                      src
                    }
                  }
                }
              }
            }
          }
          excerpt
          fields {
            layout
            slug
          }
        }
      }
    }
  }
`;

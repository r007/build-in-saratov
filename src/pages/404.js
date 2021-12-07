import { graphql, Link } from 'gatsby';
import * as React from 'react';
import styled from 'styled-components';

import PostCard from '../components/PostCard';
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
      <ErrorWrapper fullHeight>
        <ErrorCode>404</ErrorCode>
        <PageTitle>Страница не найдена</PageTitle>
        <ErrorLink to="">Перейти на главную страницу →</ErrorLink>
      </ErrorWrapper>
      <section>
        <PostFeed>
          {edges.map(({ node }) => (
            <PostCard
              key={node.fields.slug}
              slug={node.fields.slug}
              title={node.frontmatter.title}
              excerpt={node.excerpt}
              image={node.frontmatter.image?.childImageSharp.gatsbyImageData}
              tags={node.frontmatter.tags}
            />
          ))}
        </PostFeed>
      </section>
    </IndexLayout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query NotFoundPage {
    allMarkdownRemark(limit: 3, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          frontmatter {
            title
            date
            tags
            image {
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
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

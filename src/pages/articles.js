import { graphql } from 'gatsby';
import * as React from 'react';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import SEO from '../components/SEO';
import { PostsGrid, PostFeed, PageTitle } from '../styles/shared';
import PostHeader from '../components/PostHeader';

const ArticlesPage = ({ data, children }) => {
  return (
    <PostsGrid>
      <SEO title="Домашняя страница" />
      <Wrapper>
        <SiteNav />
        <PostHeader>
          <PageTitle>Статьи</PageTitle>
        </PostHeader>
        <main id="content">
          <section>
            <PostFeed>
              {data.allMarkdownRemark.edges.map(post => {
                // filter out drafts in production
                return (
                  (post.node.frontmatter.draft !== true ||
                    process.env.NODE_ENV !== 'production') && (
                    <PostCard key={post.node.fields.slug} post={post.node} />
                  )
                );
              })}
            </PostFeed>
          </section>
        </main>
        {children}
      </Wrapper>
    </PostsGrid>
  );
};

export default ArticlesPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { draft: { ne: true } } }
      limit: 1000
    ) {
      edges {
        node {
          timeToRead
          frontmatter {
            title
            date
            tags
            draft
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

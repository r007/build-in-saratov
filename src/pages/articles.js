import { graphql } from 'gatsby';
import * as React from 'react';

import IndexLayout from '../layouts';
import PostCard from '../components/PostCard';
import SEO from '../components/SEO';
import { PostsGrid, PostFeed, PageTitle } from '../styles/shared';
import PostHeader from '../components/PostHeader';

const ArticlesPage = ({ data, children }) => (
  <IndexLayout>
    <SEO title="Последние записи в блоге" />
    <PostHeader>
      <PageTitle>Статьи</PageTitle>
    </PostHeader>
    <PostsGrid id="content">
      <section>
        <PostFeed>
          {data.allMarkdownRemark.edges.map(
            (post) =>
              // filter out drafts in production
              (post.node.frontmatter.draft !== true || process.env.NODE_ENV !== 'production') && (
                <PostCard
                  key={post.node.fields.slug}
                  slug={post.node.fields.slug}
                  title={post.node.frontmatter.title}
                  excerpt={post.node.excerpt}
                  image={post.node.frontmatter.image?.childImageSharp.gatsbyImageData}
                  tags={post.node.frontmatter.tags}
                />
              ),
          )}
        </PostFeed>
      </section>
    </PostsGrid>
    {children}
  </IndexLayout>
);

export default ArticlesPage;

export const pageQuery = graphql`
  query ArticlesPage {
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
          frontmatter {
            title
            date
            tags
            draft
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

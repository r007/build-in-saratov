import { graphql } from 'gatsby';
import React from 'react';
import IndexLayout from '../layouts';
import PostCard from '../components/PostCard';
import PostHeader from '../components/PostHeader';
import { PostsGrid, PostFeed, PageTitle, PageDescription } from '../styles/shared';
import SEO from '../components/SEO';

const Tags = ({ data, pageContext }) => {
  const tag = pageContext.tag ? pageContext.tag : '';
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagData = data.allTagYaml.edges.find(
    (n) => n.node.slug.toLowerCase() === tag.toLowerCase(),
  );

  return (
    <IndexLayout>
      <SEO title={tag} description={tagData && tagData.node ? tagData.node.description : ''} />
      <PostHeader>
        <PageDescription>{tag}</PageDescription>
        <PageTitle>
          {tagData && tagData.node.description ? (
            tagData.node.description
          ) : (
            <>
              Коллекция из {totalCount > 1 && `${totalCount} записей`}
              {totalCount === 1 && 'одной записи'}
              {totalCount === 0 && 'нет записей'}
            </>
          )}
        </PageTitle>
      </PostHeader>
      <PostsGrid id="content">
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
      </PostsGrid>
    </IndexLayout>
  );
};

export default Tags;

export const pageQuery = graphql`
  query TagsTemplate($tag: String) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    allTagYaml {
      edges {
        node {
          slug
          description
          image
        }
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          frontmatter {
            title
            tags
            date
            image {
              childImageSharp {
                gatsbyImageData(layout: FULL_WIDTH)
              }
            }
          }
          fields {
            layout
            slug
          }
        }
      }
    }
  }
`;

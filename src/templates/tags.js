import { graphql } from 'gatsby';
import React from 'react';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import PostHeader from '../components/PostHeader';
import { PageTitle, PageDescription } from '../styles/shared';
import IndexLayout from '../layouts';
import SEO from '../components/SEO';

const Tags = ({ data, pageContext }) => {
  const tag = pageContext.tag ? pageContext.tag : '';
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagData = data.allTagYaml.edges.find(n => n.node.id.toLowerCase() === tag.toLowerCase());

  return (
    <IndexLayout>
      <SEO
        title={tag}
        description={tagData && tagData.node ? tagData.node.description : ''}
        image={tagData && tagData.node.image ? tagData.node.image.childImageSharp.fluid.src : ''}
      />
      <Wrapper>
        <SiteNav />
        <PostHeader
          className={`${tagData && tagData.node.image ? '' : 'no-cover'}`}
          bgImage={`${
            tagData && tagData.node.image ? tagData.node.image.childImageSharp.fluid.src : ''
          }`}
        >
          <PageDescription>{tag}</PageDescription>
          <PageTitle>
            {tagData && tagData.node.description ? (
              tagData.node.description
            ) : (
              <>
                Коллекция из {totalCount > 1 && `${totalCount} записей`}
                {totalCount === 1 && '1 записи'}
                {totalCount === 0 && 'No posts'}
              </>
            )}
          </PageTitle>
        </PostHeader>
        <main id="content">
          <section>
            {edges.map(({ node }) => (
              <PostCard key={node.fields.slug} post={node} />
            ))}
          </section>
        </main>
      </Wrapper>
    </IndexLayout>
  );
};

export default Tags;

export const pageQuery = graphql`
  query($tag: String) {
    allTagYaml {
      edges {
        node {
          id
          description
          image {
            childImageSharp {
              fluid(maxWidth: 3720) {
                ...GatsbyImageSharpFluid
              }
            }
          }
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
          timeToRead
          frontmatter {
            title
            tags
            date
            image {
              childImageSharp {
                fluid(maxWidth: 1240) {
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
          fields {
            layout
            slug
          }
        }
      }
    }
  }
`;

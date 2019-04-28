import { graphql } from 'gatsby';
import React from 'react';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import { PostHeader } from '../components/PostHeader';
import IndexLayout from '../layouts';
import {
  PostFeed,
  PostFeedRaise,
  SiteDescription,
  SiteTitle,
} from '../styles/shared';
import Helmet from 'react-helmet';

const Tags = ({ data, pageContext, pathContext }) => {
  const config = data.site.siteMetadata;
  const tag = (pageContext.tag) ? pageContext.tag : '';
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagData = data.allTagYaml.edges.find(
    n => n.node.id.toLowerCase() === tag.toLowerCase(),
  );

  return (
    <IndexLayout>
      <Helmet>
        <html lang={config.lang} />
        <title>
          {tag} - {config.title}
        </title>
        <meta
          name="description"
          content={tagData && tagData.node ? tagData.node.description : ''}
        />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${tag} - ${config.title}`} />
        <meta property="og:url" content={config.siteUrl + pathContext.slug} />
        {config.facebook && <meta property="article:publisher" content={config.facebook} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${tag} - ${config.title}`} />
        <meta name="twitter:url" content={config.siteUrl + pathContext.slug} />
        {config.twitter && (
          <meta
            name="twitter:site"
            content={`@${config.twitter.split('https://twitter.com/')[1]}`}
          />
        )}
      </Helmet>
      <Wrapper>
        <SiteNav />
        <PostHeader
          className={`${tagData && tagData.node.image ? '' : 'no-cover'}`}
          style={{
            backgroundImage:
              tagData && tagData.node.image ?
                `url('${tagData.node.image.childImageSharp.fluid.src}')` :
                '',
          }}
        >
          <SiteTitle>{tag}</SiteTitle>
          <SiteDescription>
            {tagData && tagData.node.description ? (
              tagData.node.description
            ) : (
              <>
                    A collection of {totalCount > 1 && `${totalCount} posts`}
                {totalCount === 1 && '1 запись'}
                {totalCount === 0 && 'No posts'}
              </>
            )}
          </SiteDescription>
        </PostHeader>
        <main id="content">
          <section>
            <div css={[PostFeed, PostFeedRaise]}>
              {edges.map(({ node }) => (
                <PostCard key={node.fields.slug} post={node} />
              ))}
            </div>
          </section>
        </main>
      </Wrapper>
    </IndexLayout>
  );
};

export default Tags;

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        lang
        title
        description
        siteUrl
        facebook
        twitter
      }
    }
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

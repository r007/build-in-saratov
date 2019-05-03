import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import AuthorCard from '../components/AuthorCard';
import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import PostContent from '../components/PostContent';
import PostFullFooter from '../components/PostFullFooter';
import PostFullFooterRight from '../components/PostFullFooterRight';
import ReadNextCard from '../components/ReadNextCard';
import { PostHeader } from '../components/PostHeader';
import Wrapper from '../components/Wrapper';
import SEO from '../components/SEO';
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import { outer } from '../styles/shared';

const PostFullMeta = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.midgrey};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;

  @media (max-width: 500px) {
    font-size: 1.2rem;
    line-height: 1.3em;
  }
`;

const PostFullMetaDate = styled.time`
  color: #ffffff;
`;

const PostCategoryLink = styled(Link)`
  color: #ffffff;
  word-wrap: break-word;
  text-decoration: none;
  padding-bottom: 0;
  border-bottom: 2px solid #fff;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    background: #1a1f3e;
    border-color: #1a1f3e;
  }
`;

export const PostFullTitle = styled.h1`
  color: #fff;
  margin: 0;

  @media only screen and (max-width: 1280px) {
    font-size: 1.575rem;
  }
`;

const PostFullImage = styled.figure`
  margin: 0 -10vw -165px;
  padding: 0 0 0 20rem;
  height: 800px;
  background: ${colors.lightgrey} center center;
  background-size: cover;
  border-radius: 5px;

  @media only screen and (max-width: 1560px) {
    padding: 0 0 0 15rem;
  }

  @media only screen and (max-width: 1280px) {
    padding: 0;
  }

  @media (max-width: 1170px) {
    margin: 0 -4vw -100px;
    height: 600px;
    border-radius: 0;
  }

  @media (max-width: 800px) {
    height: 400px;
  }
  @media (max-width: 500px) {
    margin-bottom: 4vw;
    height: 350px;
  }
`;

const DateDivider = styled.span`
  display: inline-block;
  margin: 0 6px 1px;
`;

const ReadNextFeed = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -20px;
  padding: 40px 0 0 0;
`;

const PageTemplate = ({ data, pageContext }) => {
  const config = data.site.siteMetadata;
  const post = data.markdownRemark;

  return (
    <IndexLayout className="post-template">
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        image={
          post.frontmatter.image && post.frontmatter.image.childImageSharp
            ? `${config.siteUrl}${post.frontmatter.image.childImageSharp.fluid.src}`
            : ''
        }
        type="article"
      />
      <Wrapper>
        <SiteNav />
        <main id="content">
          <PostHeader>
            <PostFullMeta>
              <PostFullMetaDate dateTime={post.frontmatter.date}>
                {post.frontmatter.userDate}
              </PostFullMetaDate>
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <>
                  <DateDivider>/</DateDivider>
                  <PostCategoryLink to={`/tags/${_.kebabCase(post.frontmatter.tags[0])}/`}>
                    {post.frontmatter.tags[0]}
                  </PostCategoryLink>
                </>
              )}
            </PostFullMeta>
            <PostFullTitle>{post.frontmatter.title}</PostFullTitle>
          </PostHeader>

          {post.frontmatter.image && post.frontmatter.image.childImageSharp && (
            <PostFullImage>
              <Img
                style={{ height: '100%' }}
                fluid={post.frontmatter.image.childImageSharp.fluid}
              />
            </PostFullImage>
          )}
          <PostContent htmlAst={post.htmlAst} />

          <PostFullFooter>
            <AuthorCard author={post.frontmatter.author} />
            <PostFullFooterRight authorId={post.frontmatter.author.id} />
          </PostFullFooter>
        </main>

        {/* Links to Previous/Next posts */}
        <aside className="read-next" css={outer}>
          <ReadNextFeed>
            {data.relatedPosts && (
              <ReadNextCard tags={post.frontmatter.tags} relatedPosts={data.relatedPosts} />
            )}

            {pageContext.prev && <PostCard post={pageContext.prev} />}
            {pageContext.next && <PostCard post={pageContext.next} />}
          </ReadNextFeed>
        </aside>
      </Wrapper>
    </IndexLayout>
  );
};

export default PageTemplate;

export const query = graphql`
  query($slug: String, $primaryTag: String) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    logo: file(relativePath: { eq: "img/ghost-logo.png" }) {
      childImageSharp {
        fixed {
          ...GatsbyImageSharpFixed
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      htmlAst
      excerpt
      timeToRead
      frontmatter {
        title
        userDate: date(formatString: "D MMMM YYYY")
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
                fixed(width: 80, height: 80, quality: 100) {
                  ...GatsbyImageSharpFixed
                }
              }
            }
          }
        }
      }
    }
    relatedPosts: allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$primaryTag] }, draft: { ne: true } } }
      limit: 3
    ) {
      totalCount
      edges {
        node {
          id
          timeToRead
          excerpt
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import * as _ from 'lodash';
import * as React from 'react';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet';

import AuthorCard from '../components/AuthorCard';
import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import PostContent from '../components/PostContent';
import PostFullFooter from '../components/PostFullFooter';
import PostFullFooterRight from '../components/PostFullFooterRight';
import ReadNextCard from '../components/ReadNextCard';
import { PostHeader } from '../components/PostHeader';
import Wrapper from '../components/Wrapper';
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
  border-bottom: 2px solid #fff;
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
  height: 800px;
  background: ${colors.lightgrey} center center;
  background-size: cover;
  border-radius: 5px;

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

const PageTemplate = ({ data, pageContext, pathContext }) => {
  const config = data.site.siteMetadata;
  const post = data.markdownRemark;
  let width = '';
  let height = '';
  if (post.frontmatter.image && post.frontmatter.image.childImageSharp) {
    width = post.frontmatter.image.childImageSharp.fluid.sizes.split(', ')[1].split('px')[0];
    height = String(Number(width) / post.frontmatter.image.childImageSharp.fluid.aspectRatio);
  }

  return (
    <IndexLayout className="post-template">
      <Helmet>
        <html lang={config.lang} />
        <title>{post.frontmatter.title}</title>

        <meta name="description" content={post.excerpt} />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.frontmatter.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={config.siteUrl + pathContext.slug} />
        {(post.frontmatter.image && post.frontmatter.image.childImageSharp) && (
          <meta property="og:image" content={`${config.siteUrl}${post.frontmatter.image.childImageSharp.fluid.src}`} />
        )}
        <meta property="article:published_time" content={post.frontmatter.date} />
        {/* not sure if modified time possible */}
        {/* <meta property="article:modified_time" content="2018-08-20T15:12:00.000Z" /> */}
        {post.frontmatter.tags && (
          <meta property="article:tag" content={post.frontmatter.tags[0]} />
        )}

        {config.facebook && <meta property="article:publisher" content={config.facebook} />}
        {config.facebook && <meta property="article:author" content={config.facebook} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.frontmatter.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:url" content={config.siteUrl + pathContext.slug} />
        {(post.frontmatter.image && post.frontmatter.image.childImageSharp) && (
          <meta name="twitter:image" content={`${config.siteUrl}${post.frontmatter.image.childImageSharp.fluid.src}`} />
        )}
        <meta name="twitter:label1" content="Written by" />
        <meta name="twitter:data1" content={post.frontmatter.author.id} />
        <meta name="twitter:label2" content="Filed under" />
        {post.frontmatter.tags && <meta name="twitter:data2" content={post.frontmatter.tags[0]} />}
        {config.twitter && <meta name="twitter:site" content={`@${config.twitter.split('https://twitter.com/')[1]}`} />}
        {config.twitter && <meta
          name="twitter:creator"
          content={`@${config.twitter.split('https://twitter.com/')[1]}`}
        />}
        {width && <meta property="og:image:width" content={width} />}
        {height && <meta property="og:image:height" content={height} />}
      </Helmet>
      <Wrapper>
        <SiteNav />
        <main id="content">
          <PostHeader>
            <PostFullMeta>
              <PostFullMetaDate dateTime={post.frontmatter.date}>
                {post.frontmatter.userDate}
              </PostFullMetaDate>
              {post.frontmatter.tags &&
                    post.frontmatter.tags.length > 0 && (
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

          {(post.frontmatter.image && post.frontmatter.image.childImageSharp) && (
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
        lang
        title
        description
        siteUrl
        facebook
        twitter
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
                fixed(quality: 90) {
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

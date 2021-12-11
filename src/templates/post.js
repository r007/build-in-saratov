import { graphql } from 'gatsby';
import { GatsbyImage, getSrc } from 'gatsby-plugin-image';
import * as _ from 'lodash';
import * as React from 'react';
import styled from 'styled-components';

import AuthorCard from '../components/AuthorCard';
import PostCard from '../components/PostCard';
import PostContent from '../components/PostContent';
import PostFullFooter from '../components/PostFullFooter';
import ReadNextCard from '../components/ReadNextCard';
import PostHeader from '../components/PostHeader';
import SEO from '../components/SEO';
import IndexLayout from '../layouts';
import colors from '../styles/colors';
import { outer, PageTitle, PageDescription, HeaderLink } from '../styles/shared';

const PostFullImage = styled.figure`
  padding: 0 0 0 15rem;
  background: ${colors.lightgrey} center center;
  background-size: cover;
  border-radius: 5px;

  @media only screen and (max-width: 1560px) {
    padding: 0 0 0 12rem;
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

const Card = styled(PostCard)`
  padding: 1rem;
`;

const ReadNext = styled.aside`
  ${outer}
`;

const PageTemplate = ({ data, pageContext }) => {
  const config = data.site.siteMetadata;
  const post = data.markdownRemark;
  const coverImage = getSrc(post.frontmatter.image);

  return (
    <IndexLayout className="post-template">
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        image={post.frontmatter.image ? `${config.siteUrl}${coverImage}` : ''}
        type="article"
      />
      <main id="content">
        <PostHeader>
          <PageDescription>
            <time dateTime={post.frontmatter.date}>{post.frontmatter.userDate}</time>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <>
                <DateDivider>/</DateDivider>
                <HeaderLink to={`/tags/${_.kebabCase(post.frontmatter.tags[0])}/`}>
                  {post.frontmatter.tags[0]}
                </HeaderLink>
              </>
            )}
          </PageDescription>
          <PageTitle>{post.frontmatter.title}</PageTitle>
        </PostHeader>

        {post.frontmatter.image && post.frontmatter.image.childImageSharp && (
          <PostFullImage>
            <GatsbyImage
              alt={post.frontmatter.title}
              image={post.frontmatter.image.childImageSharp.gatsbyImageData}
              style={{ height: '100%' }}
            />
          </PostFullImage>
        )}
        <PostContent htmlAst={post.htmlAst} title={post.frontmatter.title} />

        <PostFullFooter>
          <AuthorCard
            image={post.frontmatter.author.avatar.children[0].gatsbyImageData}
            name={post.frontmatter.author.name}
            bio={post.frontmatter.author.bio}
          />
        </PostFullFooter>
      </main>

      {/* Links to Previous/Next posts */}
      <ReadNext className="read-next">
        <ReadNextFeed>
          {data.relatedPosts && (
            <ReadNextCard tags={post.frontmatter.tags} relatedPosts={data.relatedPosts} />
          )}

          {pageContext.prev && (
            <Card
              key={pageContext.prev.fields.slug}
              slug={pageContext.prev.fields.slug}
              title={pageContext.prev.frontmatter.title}
              excerpt={pageContext.prev.excerpt}
              image={pageContext.prev.frontmatter.image?.childImageSharp.gatsbyImageData}
              tags={pageContext.prev.frontmatter.tags}
            />
          )}
          {pageContext.next && (
            <Card
              key={pageContext.next.fields.slug}
              slug={pageContext.next.fields.slug}
              title={pageContext.next.frontmatter.title}
              excerpt={pageContext.next.excerpt}
              image={pageContext.next.frontmatter.image?.childImageSharp.gatsbyImageData}
              tags={pageContext.next.frontmatter.tags}
            />
          )}
        </ReadNextFeed>
      </ReadNext>
    </IndexLayout>
  );
};

export default PageTemplate;

export const query = graphql`
  query PostTemplate($slug: String, $primaryTag: String) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      htmlAst
      excerpt
      frontmatter {
        title
        userDate: date(formatString: "D MMMM YYYY", locale: "ru")
        date
        tags
        image {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
        author {
          name
          bio
          avatar {
            children {
              ... on ImageSharp {
                gatsbyImageData(quality: 100, width: 80, height: 80)
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

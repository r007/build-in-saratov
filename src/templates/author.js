import { graphql } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import { css } from '@emotion/core';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import SocialLink from '../components/SocialLink';
import SEO from '../components/SEO';
import IndexLayout from '../layouts';
import {
  AuthorProfileImage,
  outer,
  SiteHeader,
  SiteHeaderContent,
  SiteTitle,
} from '../styles/shared';
import Icon from '../components/Icon';

const HiddenMobile = css`
  @media (max-width: 500px) {
    display: none;
  }
`;

const AuthorMeta = styled.div`
  z-index: 10;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 0 10px 0;
  font-family: Georgia, serif;
  font-style: italic;
`;

const AuthorBio = styled.h2`
  z-index: 10;
  flex-shrink: 0;
  margin: 5px 0 10px 0;
  max-width: 600px;
  font-size: 2rem;
  line-height: 1.3em;
  font-weight: 300;
  letter-spacing: 0.5px;
  opacity: 0.8;
`;

const Bull = styled.span`
  display: inline-block;
  margin: 0 12px;
  opacity: 0.5;
`;

const AuthorProfileBioImage = css`
  z-index: 10;
  flex-shrink: 0;
  margin: 0 0 20px 0;
  width: 100px;
  height: 100px;
  box-shadow: rgba(255, 255, 255, 0.1) 0 0 0 6px;
`;

const Author = ({ data }) => {
  const author = data.authorYaml;

  const edges = data.allMarkdownRemark.edges.filter(edge => {
    const isDraft = edge.node.frontmatter.draft !== true || process.env.NODE_ENV === 'development';
    return isDraft && edge.node.frontmatter.author && edge.node.frontmatter.author.id === author.id;
  });
  const totalCount = edges.length;

  return (
    <IndexLayout>
      <SEO
        title={author.id ? author.id : ''}
        description={author.bio ? author.bio : ''}
        image={author.profile_image ? author.profile_image.childImageSharp.fluid.src : ''}
        type="profile"
      />
      <Wrapper>
        <SiteNav />
        <header
          className="no-cover"
          css={[outer, SiteHeader]}
          style={{
            // eslint-disable-next-line @typescript-eslint/camelcase
            backgroundImage: author.profile_image
              ? `url(${author.profile_image.childImageSharp.fluid.src})`
              : '',
          }}
        >
          <SiteHeaderContent>
            <img
              css={[AuthorProfileImage, AuthorProfileBioImage]}
              src={data.authorYaml.avatar.childImageSharp.fluid.src}
              alt={author.id}
            />
            <SiteTitle>{author.id}</SiteTitle>
            {author.bio && <AuthorBio>{author.bio}</AuthorBio>}
            <AuthorMeta>
              {author.location && (
                <div css={HiddenMobile}>
                  {author.location} <Bull>&bull;</Bull>
                </div>
              )}
              <div css={HiddenMobile}>
                {totalCount > 1 && `${totalCount} posts`}
                {totalCount === 1 && '1 post'}
                {totalCount === 0 && 'No posts'} <Bull>•</Bull>
              </div>
              {author.website && (
                <div>
                  <SocialLink
                    className="social-link-wb"
                    href={author.website}
                    title="Website"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon.Globe
                      fill="none"
                      style={{
                        height: '1.8rem',
                        width: 'auto',
                        stroke: '#fff',
                        strokeWidth: '2',
                      }}
                    />
                  </SocialLink>
                </div>
              )}
              {author.facebook && (
                <SocialLink
                  className="social-link-fb"
                  href={`https://www.facebook.com/${author.facebook}`}
                  title="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon.Facebook
                    fill="#ffffff"
                    style={{
                      height: '1.8rem',
                      width: 'auto',
                    }}
                  />
                </SocialLink>
              )}
              {author.vk && (
                <SocialLink
                  className="social-link-vk"
                  href={`https://vk.com/${author.vk}`}
                  title="VK"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon.Vk
                    fill="#ffffff"
                    style={{
                      height: '1.8rem',
                      width: 'auto',
                    }}
                  />
                </SocialLink>
              )}
            </AuthorMeta>
          </SiteHeaderContent>
        </header>
        <main id="content">
          <section>
            {edges.map(({ node }) => {
              return <PostCard key={node.fields.slug} post={node} />;
            })}
          </section>
        </main>
      </Wrapper>
    </IndexLayout>
  );
};

export default Author;

export const pageQuery = graphql`
  query($author: String) {
    authorYaml(id: { eq: $author }) {
      id
      website
      twitter
      vk
      bio
      facebook
      location
      profile_image {
        childImageSharp {
          fluid(maxWidth: 3720) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      avatar {
        childImageSharp {
          fluid(maxWidth: 200) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { draft: { ne: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 2000
    ) {
      edges {
        node {
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            date
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
          fields {
            layout
            slug
          }
        }
      }
    }
  }
`;

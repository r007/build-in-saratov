import { graphql } from 'gatsby';
import React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import PostHeader from '../components/PostHeader';
import Wrapper from '../components/Wrapper';
import SocialLink from '../components/SocialLink';
import SEO from '../components/SEO';
import { PostsGrid, PostFeed, PageTitle } from '../styles/shared';
import Icon from '../components/Icon';

const AuthorCardSection = styled.div`
  display: flex;
`;

const AuthorMeta = styled.div`
  flex-shrink: 0;
  display: flex;
  margin: 0 0 10px 0;
  font-family: Georgia, serif;
  font-style: italic;
`;

const Bull = styled.span`
  display: inline-block;
  margin: 0 12px;
  opacity: 0.5;
`;

const Avatar = styled(Img)`
  flex-shrink: 0;
  border-radius: 100%;
  margin-right: 15px;
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
    <PostsGrid>
      <SEO
        title={author.id ? author.id : ''}
        description={author.bio ? author.bio : ''}
        image={author.profile_image ? author.profile_image.childImageSharp.fluid.src : ''}
        type="profile"
      />
      <Wrapper>
        <SiteNav />
        <PostHeader
          className="no-cover"
          style={{
            backgroundImage: author.profile_image
              ? `url(${author.profile_image.childImageSharp.fluid.src})`
              : '',
          }}
        >
          <AuthorCardSection>
            <Avatar
              fixed={data.authorYaml.avatar.childImageSharp.fixed}
              objectFit="cover"
              objectPosition="50% 50%"
              alt={author.id}
            />
            <div className="author-header">
              <PageTitle>{author.id}</PageTitle>
              <AuthorMeta>
                {author.location && (
                  <div className="hidden-mobile">
                    {author.location} <Bull>&bull;</Bull>
                  </div>
                )}
                <div className="hidden-mobile">
                  {totalCount > 1 && `${totalCount} записей`}
                  {totalCount === 1 && 'Одна запись'}
                  {totalCount === 0 && 'Нет записей'} <Bull>•</Bull>
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
                          height: '1rem',
                          width: 'auto',
                          stroke: '#fff',
                          strokeWidth: '2',
                        }}
                      />
                    </SocialLink>
                  </div>
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
                        height: '1rem',
                        width: 'auto',
                      }}
                    />
                  </SocialLink>
                )}
                {author.quora && (
                  <SocialLink
                    className="social-link-quora"
                    href={`https://www.quora.com/profile/${author.quora}`}
                    title="Quora"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon.Quora
                      fill="#ffffff"
                      style={{
                        height: '1rem',
                        width: 'auto',
                      }}
                    />
                  </SocialLink>
                )}
              </AuthorMeta>
            </div>
          </AuthorCardSection>
        </PostHeader>
        <main id="content">
          <section>
            <PostFeed>
              {edges.map(({ node }) => {
                return <PostCard key={node.fields.slug} post={node} />;
              })}
            </PostFeed>
          </section>
        </main>
      </Wrapper>
    </PostsGrid>
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
      quora
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
          fixed(width: 80, height: 80, quality: 100) {
            ...GatsbyImageSharpFixed
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

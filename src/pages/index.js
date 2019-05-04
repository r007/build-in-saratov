import { graphql } from 'gatsby';
import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import IconCalloutGroup from '../components/IconCalloutGroup';
import IconCallout from '../components/IconCallout';
import SEO from '../components/SEO';
import IndexLayout from '../layouts';
import { PostFeed, SiteHeaderContent, PageTitle } from '../styles/shared';
import PostHeader from '../components/PostHeader';
import Logo from '../content/img/logo.svg';
import ScrollDownArrow from '../content/img/next-arrow.svg';

const HomePosts = css`
  @media (min-width: 795px) and (max-width: 1280px) {
    .post-card:nth-of-type(6n + 1):not(.no-image) {
      flex: 1 1 100%;
      flex-direction: column;
      background-color: #f0f0f0;
      padding: 20px;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-image-link {
      position: relative;
      flex: 1 1 auto;
      order: 1;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-content {
      order: 2;
    }
  }

  @media (min-width: 1281px) {
    .post-card:nth-of-type(6n + 1):not(.no-image) {
      flex: 1 1 100%;
      flex-direction: row;
      background-color: #f0f0f0;
      padding: 35px;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-image-link {
      position: relative;
      flex: 1 1 auto;
      order: 2;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-image {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-content {
      flex: 0 1 40%;
      order: 1;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) h2 {
      font-size: 1.3rem;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) p {
      font-size: 0.9rem;
      line-height: 1.55em;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-content-link,
    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-meta {
      padding: 0 35px 0 0;
    }
  }
`;

const scrollDownButton = keyframes`
  to {
    transform:translateY(20px)
  }
`;

const ScrollDown = styled.div`
  position: absolute;
  bottom: 10vh;
  animation: ${scrollDownButton} 1.6s ease-in-out infinite alternate;
  transform-origin: center;
  cursor: pointer;

  :before {
    content: url(${ScrollDownArrow});
    display: block;
    width: 50px;
    cursor: pointer;
    transform: rotate(90deg);
  }
`;

const IndexPage = ({ data, children }) => {
  const config = data.site.siteMetadata;

  return (
    <IndexLayout css={HomePosts}>
      <SEO title="Домашняя страница" />
      <Wrapper>
        <SiteNav />
        <PostHeader fullHeight>
          <SiteHeaderContent>
            <img
              style={{ height: '100px', width: 'auto', display: 'block', marginBottom: '1rem' }}
              src={Logo}
              alt={config.title}
            />
            <PageTitle>{config.description}</PageTitle>
            <ScrollDown className="scrollDown" />
          </SiteHeaderContent>
        </PostHeader>
        <main id="content">
          <section>
            <IconCalloutGroup>
              <IconCallout
                iconName="Deploy"
                title="Ускорение сайта"
                copy="Повышение конверсии и уменьшение показателя отказов за счет быстрой загрузки"
                url="/contact"
              />

              <IconCallout
                iconName="Inspect"
                title="Консультации"
                copy="По выбору хостинга, технологий, способу реализации"
                url="/contact"
              />

              <IconCallout
                iconName="Configure"
                title="Доработки"
                copy="Изменения в готовом сайте, исправление ошибок, написание плагинов"
                url="/contact"
              />

              <IconCallout
                iconName="Send"
                title="Создание"
                copy="Проектирование сайта с нуля специально под заказчика"
                url="/contact"
              />
            </IconCalloutGroup>
          </section>
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
    </IndexLayout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    header: file(relativePath: { eq: "img/blog-cover.jpg" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fluid(maxWidth: 2000) {
          ...GatsbyImageSharpFluid
        }
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

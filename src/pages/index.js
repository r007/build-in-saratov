import { graphql } from 'gatsby';
import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import Helmet from 'react-helmet';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import IconCalloutGroup from '../components/IconCalloutGroup';
import IconCallout from '../components/IconCallout';
import IndexLayout from '../layouts';
import {
  outer,
  PostFeed,
  SiteDescription,
  SiteHeader,
  SiteHeaderContent,
  SiteTitle,
} from '../styles/shared';
import Logo from '../content/img/logo.svg';
import ScrollDownArrow from '../content/img/next-arrow.svg';

const HomePosts = css`
  @media (min-width: 795px) {
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

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-content-link {
      padding: 0 35px 0 0;
    }

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
  const width = data.header.childImageSharp.fluid.sizes.split(', ')[1].split('px')[0];
  const height = String(Number(width) / data.header.childImageSharp.fluid.aspectRatio);
  return (
    <IndexLayout css={HomePosts}>
      <Helmet>
        <html lang={config.lang} />
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <meta property="og:site_name" content={config.title} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.description} />
        <meta property="og:url" content={config.siteUrl} />
        <meta
          property="og:image"
          content={`${config.siteUrl}${data.header.childImageSharp.fluid.src}`}
        />
        {config.facebook && <meta property="article:publisher" content={config.facebook} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={config.title} />
        <meta name="twitter:description" content={config.description} />
        <meta name="twitter:url" content={config.siteUrl} />
        <meta
          name="twitter:image"
          content={`${config.siteUrl}${data.header.childImageSharp.fluid.src}`}
        />
        {config.twitter && (
          <meta
            name="twitter:site"
            content={`@${config.twitter.split('https://twitter.com/')[1]}`}
          />
        )}
        <meta property="og:image:width" content={width} />
        <meta property="og:image:height" content={height} />
      </Helmet>
      <Wrapper>
        <SiteNav />
        <header
          css={[outer, SiteHeader]}
        >
          <SiteHeaderContent>
            <SiteTitle>
              <img
                style={{ height: '100px', width: 'auto', display: 'block', marginBottom: '1rem' }}
                src={Logo}
                alt={config.title}
              />
            </SiteTitle>
            <SiteDescription>{config.description}</SiteDescription>
            <ScrollDown className="scrollDown" />
          </SiteHeaderContent>
        </header>
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
            <div css={[PostFeed]}>
              {data.allMarkdownRemark.edges.map(post => {
              // filter out drafts in production
                return (
                  (post.node.frontmatter.draft !== true ||
                    process.env.NODE_ENV !== 'production') && (
                    <PostCard key={post.node.fields.slug} post={post.node} />
                  )
                );
              })}
            </div>
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
        lang
        title
        description
        siteUrl
        facebook
        twitter
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
      sort: { fields: [frontmatter___date], order: DESC },
      filter: { frontmatter: { draft: { ne: true } } },
      limit: 1000,
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
import { graphql } from 'gatsby';
import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import SiteNav from '../components/header/SiteNav';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import IconCalloutGroup from '../components/IconCalloutGroup';
import IconCallout from '../components/IconCallout';
import SEO from '../components/SEO';
import { PostsGrid, PostFeed, SiteHeaderContent, PageTitle } from '../styles/shared';
import PostHeader from '../components/PostHeader';
import Logo from '../content/img/logo.svg';
import ScrollDownArrow from '../content/img/next-arrow.svg';

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
    <PostsGrid>
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
                copy="Ведь не только Red Bull окрыляет, но и прямые руки веб-разработчика"
                url="/contact"
              />

              <IconCallout
                iconName="Inspect"
                title="Консультации"
                copy="Не разбираетесь в программировании? Лучше спросите у профессионала"
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
    </PostsGrid>
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

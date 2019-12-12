import { graphql, Link } from 'gatsby';
import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import IndexLayout from '../layouts';
import PostCard from '../components/PostCard';
import IconCalloutGroup from '../components/IconCalloutGroup';
import IconCallout from '../components/IconCallout';
import SEO from '../components/SEO';
import { PostsGrid, PostFeed, SiteHeaderContent, PageTitle } from '../styles/shared';
import PostHeader from '../components/PostHeader';
import Heading from '../components/Heading';
import Logo from '../content/img/logo.svg';
import ScrollDownArrow from '../content/img/next-arrow.svg';
import BlueArrow from '../content/img/darkblue-arrow.svg';

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

const SectionHeading = styled(Row)`
  margin-bottom: 2.5rem;

  a {
    margin-top: 0.5rem;
    display: block;
    position: relative;

    &:after {
      content: '';
      background: url(${BlueArrow});
      background-repeat: no-repeat;
      width: 0.8em;
      height: 0.8em;
      position: relative;
      display: inline-block;
      vertical-align: middle;
      margin-left: -10px;
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    :hover {
      text-decoration: none;

      &:after {
        margin-left: 10px;
        opacity: 1;
      }
    }
  }
`;

const IndexPage = ({ data, children }) => {
  const config = data.site.siteMetadata;

  return (
    <IndexLayout>
      <SEO
        title="Домашняя страница"
        description="Блог веб-разработчика. Всё, что интересует людей, ответы на часто задаваемые вопросы, советы, обзоры. Рассказываю о последних трендах в сайтостроении."
        image={
          data.CoverImage
            ? data.site.siteMetadata.siteUrl + data.CoverImage.childImageSharp.fluid.src
            : ''
        }
      />
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
      <PostsGrid id="content">
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
          <SectionHeading center="xs">
            <Col xs={12} md={10} lg={9}>
              <Heading>Полевые заметки</Heading>
              <small>
                Подробные статьи, уроки. Здесь я делюсь мыслями о веб-разработке, современных
                JavaScript фреймворках, CMS и интернет-магазинах.
              </small>
              <Link to="/articles">Все статьи</Link>
            </Col>
          </SectionHeading>
          <PostFeed>
            {data.allMarkdownRemark.edges.map(post => {
              // filter out drafts in production
              return (
                (post.node.frontmatter.draft !== true || process.env.NODE_ENV !== 'production') && (
                  <PostCard key={post.node.fields.slug} post={post.node} />
                )
              );
            })}
          </PostFeed>
        </section>
      </PostsGrid>
      {children}
    </IndexLayout>
  );
};

export default IndexPage;

export const pageQuery = graphql`
  query HomePage {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }

    CoverImage: file(relativePath: { eq: "img/home-cover.png" }) {
      childImageSharp {
        fluid(quality: 90) {
          ...GatsbyImageSharpFluid_withWebp
        }
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
      limit: 4
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
                  ...GatsbyImageSharpFluid_withWebp
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

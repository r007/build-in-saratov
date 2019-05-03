import { graphql, Link } from 'gatsby';
import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import SiteNavLogo from '../components/header/SiteNavLogo';
import PostCard from '../components/PostCard';
import Wrapper from '../components/Wrapper';
import IndexLayout from '../layouts';
import { colors } from '../styles/colors';
import { outer, PostFeed, SiteHeader } from '../styles/shared';

const SiteNavCenter = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .site-nav-logo {
    margin-right: 0;
  }
`;

const ErrorTemplate = css`
  padding: 7vw 4vw;
`;

const ErrorCode = styled.h1`
  margin: 0;
  font-size: 12vw;
  line-height: 1em;
  letter-spacing: -5px;
  opacity: 0.3;
`;

const ErrorDescription = styled.p`
  margin: 0;
  color: ${colors.midgrey};
  font-size: 3rem;
  line-height: 1.3em;
  font-weight: 400;
`;

const ErrorLink = css`
  display: inline-block;
  margin-top: 5px;
`;

const NotFoundPage = ({ data }) => {
  const { edges } = data.allMarkdownRemark;

  return (
    <IndexLayout>
      <Wrapper>
        <header css={[SiteHeader, outer]}>
          <SiteNavCenter>
            <SiteNavLogo />
          </SiteNavCenter>
        </header>
        <main id="content" css={[ErrorTemplate, outer]}>
          <section style={{ textAlign: 'center' }}>
            <ErrorCode>404</ErrorCode>
            <ErrorDescription>Page not found</ErrorDescription>
            <Link css={ErrorLink} to="">
              Go to the front page →
            </Link>
          </section>
        </main>
        <section>
          <div css={PostFeed}>
            {edges.map(({ node }) => (
              <PostCard key={node.fields.slug} post={node} />
            ))}
          </div>
        </section>
      </Wrapper>
    </IndexLayout>
  );
};

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(limit: 3, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          timeToRead
          frontmatter {
            title
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

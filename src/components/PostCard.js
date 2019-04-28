import { Link } from 'gatsby';
import Img from 'gatsby-image';
import * as React from 'react';
import styled, { css } from 'styled-components';

import { colors } from '../styles/colors';

const PostCardWrapper = styled.article`
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 20px 40px;
  min-height: 300px;
  background: #fff center center;
  background-size: cover;
  transition: all 0.5s ease;
`;

const PostCardImageLink = css`
  position: relative;
  display: block;
  overflow: hidden;
`;

const PostCardImage = styled.div`
  width: auto;
  height: 300px;
  background: ${colors.lightgrey} no-repeat center center;
  background-size: cover;
`;

const PostCardContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PostCardContentLink = css`
  position: relative;
  flex-grow: 1;
  display: block;
  padding: 25px 0 0;
  color: ${colors.darkgrey};

  :hover {
    text-decoration: none;
  }
`;

const PostCardTags = styled.span`
  display: block;
  margin-bottom: 4px;
  color: ${colors.midgrey};
  font-size: 0.6rem;
  line-height: 1.15em;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const PostCardTitle = styled.h2`
  font-size: 1rem;
  margin-top: 0;
  color: #164194;
`;

const PostCardExcerpt = styled.div`
  font-size: 0.7rem;
`;

const PostCardMeta = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 0 25px;
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 12px 20px 12px 20px;
  line-height: 1em;
  font-size: 0.7rem;
  color: #ffffff;
  background: #164194;
  border: none;
  position: relative;
  text-align: center;
`;

const PostCard = ({ post }) => {
  return (
    <PostCardWrapper
      className={`post-card ${post.frontmatter.image ? '' : 'no-image'}`}
    >
      {post.frontmatter.image && (
        <Link className="post-card-image-link" css={PostCardImageLink} to={post.fields.slug}>
          <PostCardImage className="post-card-image">
            {post.frontmatter.image &&
              post.frontmatter.image.childImageSharp &&
              post.frontmatter.image.childImageSharp.fluid && (
              <Img
                alt={`${post.frontmatter.title} cover image`}
                style={{ height: '100%' }}
                fluid={post.frontmatter.image.childImageSharp.fluid}
              />
            )}
          </PostCardImage>
        </Link>
      )}
      <PostCardContent className="post-card-content">
        <Link className="post-card-content-link" css={PostCardContentLink} to={post.fields.slug}>
          <header className="post-card-header">
            {post.frontmatter.tags && <PostCardTags>{post.frontmatter.tags[0]}</PostCardTags>}
            <PostCardTitle>{post.frontmatter.title}</PostCardTitle>
          </header>
          <PostCardExcerpt>
            <p>{post.excerpt}</p>
          </PostCardExcerpt>
        </Link>
        <PostCardMeta className="post-card-meta">
          <Button to={post.fields.slug}>
            Читать далее
          </Button>
        </PostCardMeta>
      </PostCardContent>
    </PostCardWrapper>
  );
};

export default PostCard;

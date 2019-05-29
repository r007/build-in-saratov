import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import styled from 'styled-components';

import colors from '../styles/colors';

const PostCardWrapper = styled.article`
  flex: 1 1 300px;
  min-height: 300px;
  background: #fff center center;
  background-size: cover;
  transition: all 0.5s ease;

  @media only screen and (min-width: 601px) {
    margin: 0 20px 40px;
  }
`;

const PostCardLink = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;

  :hover {
    text-decoration: none;
  }
`;

const PostCardImage = styled.div`
  position: relative;
  display: block;
  width: auto;
  height: 300px;
  background: ${colors.lightgrey} no-repeat center center;
  background-size: cover;
  margin-bottom: 25px;

  :after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    height: 5px;
    background: #164194;
    transform: scaleX(0.25);
    transform-origin: 0 0;
    transition: all 0.4s;
  }

  ${PostCardLink}:hover &:after,
  ${PostCardLink}:focus &:after {{
    transition-duration: 0.2s;
    transform: scaleX(1);
    background: #ad005f;
  }
`;

const PostCardContent = styled.div`
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${colors.darkgrey};
`;

const PostCardTags = styled.span`
  display: inline-block;
  margin-bottom: 10px;
  color: #ad005f;
  line-height: 1.15em;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;

  @media only screen and (min-width: 601px) {
    font-size: 0.6rem;
  }
`;

const PostCardTitle = styled.h2`
  margin: 0 0 0.75em 0;
  color: #164194;

  @media only screen and (min-width: 601px) {
    font-size: 1rem;
  }
`;

const PostCardExcerpt = styled.div`
  @media only screen and (min-width: 601px) {
    font-size: 0.7rem;
  }
`;

const PostCard = ({ className, post }) => {
  return (
    <PostCardWrapper
      className={`post-card ${post.frontmatter.image ? '' : 'no-image'} ${className}`}
    >
      <PostCardLink
        aria-label={post.frontmatter.title}
        className="post-card-link"
        to={post.fields.slug}
      >
        <div className="post-card-image-wrapper">
          {post.frontmatter.image && (
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
          )}
        </div>
        <PostCardContent className="post-card-content">
          <header className="post-card-header">
            {post.frontmatter.tags && <PostCardTags>{post.frontmatter.tags[0]}</PostCardTags>}
            <PostCardTitle>{post.frontmatter.title}</PostCardTitle>
          </header>
          <PostCardExcerpt>
            <p>{post.excerpt}</p>
          </PostCardExcerpt>
        </PostCardContent>
      </PostCardLink>
    </PostCardWrapper>
  );
};

PostCard.propTypes = {
  className: PropTypes.string,
  post: PropTypes.oneOfType([PropTypes.object]),
};

PostCard.defaultProps = {
  className: '',
  post: {},
};

export default PostCard;

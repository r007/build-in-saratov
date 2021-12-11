import { Link, StaticQuery, graphql } from 'gatsby';
import * as React from 'react';
import styled from 'styled-components';
import * as _ from 'lodash';

import Icon from './Icon';

const ReadNextCardStyles = styled.article`
  position: relative;
  flex: 1 1 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0 20px 40px;
  padding: 25px;
  color: #fff;
  background: #164194;
  border-radius: 5px;
  box-shadow: rgba(39, 44, 49, 0.06) 8px 14px 38px, rgba(39, 44, 49, 0.03) 1px 3px 8px;
`;

const ReadNextCardHeader = styled.header`
  position: relative;
  z-index: 50;
  padding-top: 20px;
  text-align: center;
`;

const ReadNextCardHeaderSitetitle = styled.small`
  display: block;
  font-size: 1.3rem;
  line-height: 1.3em;
  opacity: 0.8;
`;

const ReadNextCardHeaderTitle = styled.h3`
  margin: 0;
  padding: 0 20px;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.2em;
  letter-spacing: 1px;

  a {
    color: #fff;
    font-weight: 300;
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }
`;

const ReadNextDivider = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  height: 80px;
`;

const ReadNextCardContent = styled.div`
  position: relative;
  z-index: 50;
  flex-grow: 1;
  display: flex;
  font-size: 0.9rem;

  ul {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 0;
    text-align: center;
    list-style: none;
  }

  li {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    line-height: 1.25em;
    font-weight: 200;
    letter-spacing: -0.5px;
  }

  li a {
    display: block;
    padding: 20px 0;
    border-bottom: rgba(255, 255, 255, 0.3) 1px solid;
    color: #fff;
    font-weight: 500;
    vertical-align: top;
    transition: opacity 0.3s ease;
  }

  li:first-of-type a {
    padding-top: 10px;
  }

  li a:hover {
    opacity: 1;
  }
`;

const ReadNextCardFooter = styled.footer`
  position: relative;
  margin: 15px 0 3px 0;
  text-align: center;

  a {
    font-size: 0.7rem;
    color: #fff;
  }
`;

const ReadNextCard = ({ tags, relatedPosts }) => (
  <StaticQuery
    query={graphql`
      query ReadNextQuery {
        header: file(relativePath: { eq: "img/blog-cover.jpg" }) {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    `}
    // tslint:disable-next-line:react-this-binding-issue
    render={() => (
      <ReadNextCardStyles>
        <ReadNextCardHeader>
          <ReadNextCardHeaderSitetitle>Категория</ReadNextCardHeaderSitetitle>
          <ReadNextCardHeaderTitle>
            <Link to={`/tags/${_.kebabCase(tags[0])}/`}>{tags[0]}</Link>
          </ReadNextCardHeaderTitle>
        </ReadNextCardHeader>
        <ReadNextDivider>
          <Icon.Inf
            fill="#ffffff"
            style={{
              width: '40px',
              height: 'auto',
              fill: 'transparent',
              stroke: '#fff',
              strokeWidth: '0.5px',
              strokeOpacity: 0.65,
            }}
          />
        </ReadNextDivider>
        <ReadNextCardContent>
          <ul>
            {relatedPosts.edges.map((n) => (
              <li key={n.node.frontmatter.title}>
                <Link to={n.node.fields.slug}>{n.node.frontmatter.title}</Link>
              </li>
            ))}
          </ul>
        </ReadNextCardContent>
        <ReadNextCardFooter>
          <Link to={`/tags/${_.kebabCase(tags[0])}/`}>
            {relatedPosts.totalCount > 1 && `Все ${relatedPosts.totalCount} записи`}
            {relatedPosts.totalCount === 1 && '1 запись'}
            {relatedPosts.totalCount === 0 && 'Нет записей'} →
          </Link>
        </ReadNextCardFooter>
      </ReadNextCardStyles>
    )}
  />
);

export default ReadNextCard;

import { Global, css } from '@emotion/core';
import { darken, lighten } from 'polished';
import * as React from 'react';
import Helmet from 'react-helmet';

import { colors } from '../styles/colors';
// @ts-ignore
import favicon from '../../src/favicon.ico';

interface IndexProps {
  className?: string;
}

const GlobalStyles = css`
  body {
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    text-rendering: geometricPrecision;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -moz-font-feature-settings: 'liga' on;
  }
    
  html {
    overflow-x: hidden;
    overflow-y: scroll;
    font-family: sans-serif;
    -webkit-text-size-adjust: 100%;
    color: ${darken('0.25', colors.midgrey)};
    font-size: 1em;
    line-height: 1.4;
  }
    
  body, html {
    font: normal 29px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  }

  ::selection {
    text-shadow: none;
    background: ${lighten('0.3', colors.blue)};
  }

  section {
    background: #fff;
    position: relative;
    padding: 3rem 3rem 0 20rem;
    overflow: hidden;
  }

  section blockquote,
  section h2,
  section h3,
  section ol,
  section p,
  section ul {
    max-width: 30em;
    position: relative;
    font-family: Georgia, serif;
  }

  hr {
    position: relative;
    display: block;
    width: 100%;
    margin: 2.5em 0 3.5em;
    padding: 0;
    height: 1px;
    border: 0;
    border-top: 1px solid ${lighten('0.1', colors.lightgrey)};
  }

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  fieldset {
    margin: 0;
    padding: 0;
    border: 0;
  }

  textarea {
    resize: vertical;
  }

  p,
  ul,
  ol,
  dl,
  blockquote {
    margin: 0 0 1.5em 0;
  }

  ol,
  ul {
    padding-left: 1.3em;
    padding-right: 1.5em;
  }

  ol ol,
  ul ul,
  ul ol,
  ol ul {
    margin: 0.5em 0 1em;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  ul,
  ol {
    max-width: 100%;
  }

  li {
    margin: 0.5em 0;
    padding-left: 0.3em;
    line-height: 1.6em;
  }

  dt {
    float: left;
    margin: 0 20px 0 0;
    width: 120px;
    color: ${colors.darkgrey};
    font-weight: 500;
    text-align: right;
  }

  dd {
    margin: 0 0 5px 0;
    text-align: left;
  }

  blockquote {
    margin: 1.5em 0;
    padding: 0 1.6em 0 1.6em;
    border-left: ${colors.whitegrey} 0.5em solid;
  }

  blockquote p {
    margin: 0.8em 0;
    font-size: 1.2em;
    font-weight: 300;
  }

  blockquote small {
    display: inline-block;
    margin: 0.8em 0 0.8em 1.5em;
    font-size: 0.9em;
    opacity: 0.8;
  }

  blockquote small:before {
    content: '\\2014 \\00A0';
  }

  blockquote cite {
    font-weight: bold;
  }
  blockquote cite a {
    font-weight: normal;
  }

  a {
    color: ${darken('0.05', colors.blue)};
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    line-height: 1.15;
    font-weight: 700;
    text-rendering: optimizeLegibility;
  }

  h1 {
    margin: 0 0 0.5em 0;
    font-size: 58px;
    font-weight: 700;
  }
  @media (max-width: 500px) {
    h1 {
      font-size: 2.2rem;
    }
  }

  h2 {
    margin: 1.5em 0 0.5em 0;
    font-size: 2rem;
  }
  @media (max-width: 500px) {
    h2 {
      font-size: 1.8rem;
    }
  }

  h3 {
    margin: 1.5em 0 0.5em 0;
    font-size: 1.8rem;
    font-weight: 500;
  }
  @media (max-width: 500px) {
    h3 {
      font-size: 1.7rem;
    }
  }

  h4 {
    margin: 1.5em 0 0.5em 0;
    font-size: 1.6rem;
    font-weight: 500;
  }

  h5 {
    margin: 1.5em 0 0.5em 0;
    font-size: 1.4rem;
    font-weight: 500;
  }

  h6 {
    margin: 1.5em 0 0.5em 0;
    font-size: 1.4rem;
    font-weight: 500;
  }

  body {
    background: #f4f8fb;
  }
`;

const IndexLayout: React.FunctionComponent<IndexProps> = props => {
  return (
    <div className={props.className}>
      <Helmet>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <Global styles={GlobalStyles} />
      {props.children}
    </div>
  );
};

export default IndexLayout;

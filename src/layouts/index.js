import { Global, css } from '@emotion/core';
import { lighten } from 'polished';
import * as React from 'react';
import Helmet from 'react-helmet';

import { colors } from '../styles/colors';
// @ts-ignore
import favicon from '../../src/favicon.ico';

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
    color: #000000;
    font-size: 1em;
    line-height: 1.4;
  }
    
  body, html {
    font: normal 29px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;

    @media only screen and (max-width: 800px) {
      font-size: 23px;
      line-height: 1.55;
    }

    @media only screen and (max-width: 600px) {
      font-size: 18px;
    }
  }

  ::selection {
    text-shadow: none;
    background: #b3d4fc;
  }

  section {
    background: #fff;
    position: relative;
    padding: 3rem 3rem 0 20rem;
    overflow: hidden;
    
    @media only screen and (max-width: 1560px) {
      padding: 1rem 2rem 0 15rem
    }

    @media only screen and (max-width: 1280px) {
      padding: 2rem 3rem 0 3.4rem;
    }

    @media only screen and (max-width: 460px) {
      padding: 1rem 1rem 0 1rem;
    }
  }

  section blockquote,
  section h2,
  section h3,
  section ol,
  section p,
  section ul {
    max-width: 30em;
    position: relative;
  }

  figure {
    margin: 0;
    padding: 1em 0;
  }

  figcaption {
    color: #ad005f;
    font-size: .827rem;
    padding: 1rem 30% 0 0;

    @media only screen and (max-width: 800px) {
      padding-right: 0;
    }
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
    color: #164194;
    text-decoration: none;
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
    margin: .67em 0;
    font-size: 2.41rem;
    font-weight: normal;
    line-height: 1.1;
    
    @media only screen and (max-width: 1280px) {
      font-size: 58px;
    }
  }

  h2 {
    margin: 1rem 0 0 0;
    font-size: 1.55rem;
    line-height: 1.2;
    display: block;
  }

  h3 {
    margin: 1.45em 0 0 0;
    font-size: 1rem;
    line-height: 1.45; 
  }

  h4 {
    margin: 1.5em 0 0.5em 0;
    font-size: .8rem;
  }

  h5 {
    margin: 1.5em 0 0.5em 0;
    font-size: 1.4rem;
    font-weight: 500;
  }

  body {
    background: #f4f8fb;
  }
`;

const IndexLayout = ({ className, children }) => {
  return (
    <div className={className}>
      <Helmet>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <Global styles={GlobalStyles} />
      {children}
    </div>
  );
};

export default IndexLayout;

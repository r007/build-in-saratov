import { lighten, setLightness, darken, setSaturation } from 'polished';
import * as React from 'react';
import styled from 'styled-components';
import RehypeReact from 'rehype-react';

import SocialShareContainer from './SocialShareContainer';
import SocialShare from './SocialShare';
import colors from '../styles/colors';
import LinkImg from '../content/img/Externer_Link_XH.svg';

export const PostFullContent = styled.article`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol,
  dl,
  pre,
  blockquote,
  .post-full-comments,
  .footnotes {
    min-width: 100%;
  }

  li {
    word-break: break-word;
  }

  li p {
    margin: 0;
  }

  a {
    color: inherit;
    word-wrap: break-word;
    text-decoration: none;
    padding-bottom: 0;
    border-bottom: 2px solid #222;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  a:hover {
    background: #c4e0ff;
    border-color: #c4e0ff;
  }

  /* External links */
  a[href*="//"]:not([href*="https://build-in-saratov.com"]):after
  {
    content: '';
    background: url(${LinkImg});
    background-repeat: repeat;
    background-repeat: no-repeat;
    display: inline-block;
    width: 1.1em;
    height: 0.7em;
    margin-left: 0.25em;
  }

  strong,
  em {
    /* color: color(var(--darkgrey) l(-5%)); */
    color: ${darken('0.05', colors.darkgrey)};
  }

  small {
    display: inline-block;
    line-height: 1.6em;
  }

  li:first-child {
    margin-top: 0;
  }

  .gatsby-resp-image-link {
    box-shadow: none;
  }

  img,
  video {
    display: block;
    margin: 0;
    height: auto;
  }

  @media (max-width: 1040px) {
    img,
    video {
      width: 100%;
    }
  }

  img[src$='#full'] {
    max-width: none;
    width: 100vw;
  }

  img + br + small {
    display: block;
    margin-top: -3em;
    margin-bottom: 1.5em;
    text-align: center;
  }

  /* Override third party iframe styles */
  iframe {
    margin: 0 auto !important;
  }

  p code {
    word-break: break-all;
  }

  /* .fluid-width-video-wrapper { */
  .gatsby-resp-iframe-wrapper {
    margin: 1.5em 0 3em;
  }

  hr {
    margin: 4vw 0;
  }

  hr:after {
    content: '';
    position: absolute;
    top: -15px;
    left: 50%;
    display: block;
    margin-left: -10px;
    width: 1px;
    height: 30px;
    /* background: color(var(--lightgrey) l(+10%)); */
    background: ${lighten('0.1', colors.lightgrey)};
    box-shadow: #fff 0 0 0 5px;
    transform: rotate(45deg);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${setLightness('0.05', colors.darkgrey)};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
  }

  h5 {
    display: block;
    margin: 0;
    padding: 1.45em 0 0 0;
    border: 0;
    color: ${colors.blue};
    font-family: Georgia, serif;
    font-size: 1rem;
    line-height: 1.35em;
    text-align: center;
  }
  @media (min-width: 1180px) {
    h5 {
      max-width: 1060px;
    }
  }

  /* Tables */
  table {
    display: inline-block;
    overflow-x: auto;
    margin: 0.5em 0 2.5em;
    max-width: 100%;
    width: auto;
    border-spacing: 0;
    border-collapse: collapse;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
      'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1rem;
    white-space: nowrap;
    vertical-align: top;
  }

  table {
    -webkit-overflow-scrolling: touch;
    background: radial-gradient(ellipse at left, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 0
        center,
      radial-gradient(ellipse at right, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 75%) 100% center;
    background-attachment: scroll, scroll;
    background-size: 10px 100%, 10px 100%;
    background-repeat: no-repeat;
  }

  table td:first-child {
    background-image: linear-gradient(
      to right,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 20px 100%;
    background-repeat: no-repeat;
  }

  table td:last-child {
    background-image: linear-gradient(
      to left,
      rgba(255, 255, 255, 1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    background-position: 100% 0;
    background-size: 20px 100%;
    background-repeat: no-repeat;
  }

  table th {
    color: ${colors.darkgrey};
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.2px;
    text-align: left;
    text-transform: uppercase;
    /* background-color: color(var(--whitegrey) l(+4%)); */
    background-color: ${lighten('0.04', colors.whitegrey)};
  }

  table th,
  table td {
    padding: 6px 12px;
    /* border: color(var(--whitegrey) l(-1%) s(-5%)) 1px solid; */
    border: ${setSaturation('0.05', darken('0.01', colors.whitegrey))} 1px solid;
  }

  code[class*='language-']::selection,
  code[class*='language-'] span::selection,
  pre[class*='language-']::selection,
  pre[class*='language-'] span::selection {
    color: inherit;
    background: rgba(33, 66, 131, 0.85);
  }

  /* Inline code */
  :not(pre) > code[class*='language-'] {
    border-radius: 0.3em;
    background: var(--inlineCode-bg);
    color: var(--inlineCode-text);
    padding: 0.15em 0.2em 0.05em;
    white-space: normal;
  }

  pre[data-line] {
    padding: 1em 0 1em 3em;
    position: relative;
  }

  .gatsby-highlight-code-line {
    display: block;
    margin-right: -1.3125rem;
    margin-left: -1.3125rem;
    padding-right: 1em;
    padding-left: 1.25em;
    border-left: 0.25em solid #ffa7c4;
  }

  .gatsby-highlight pre[class*='language-'] {
    font-size: 0.7rem;
    box-sizing: border-box;
  }
  /* End Syntax Highlighting */
`;

const renderAst = new RehypeReact({
  createElement: React.createElement,
  // components: { 'interactive-counter': Counter },
  components: {},
}).Compiler;

const Ast = ({ ast, ...props }) => {
  const abstractTree = ast;
  abstractTree.properties = props;
  return renderAst(abstractTree);
};

const PostContent = ({ htmlAst, title }) => {
  return (
    <section className="post-full-content">
      <PostFullContent>
        {/* TODO: this will apply the class when rehype-react is published https://github.com/rhysd/rehype-react/pull/11 */}
        <Ast className="post-content" ast={htmlAst} />
      </PostFullContent>
      {typeof window !== 'undefined' && (
        <SocialShareContainer
          text={title}
          url={window.location.href}
          headingText="Поделитесь этой записью:"
        >
          {SocialShare}
        </SocialShareContainer>
      )}
    </section>
  );
};

export default PostContent;

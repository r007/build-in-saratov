import { graphql, StaticQuery, Link } from 'gatsby';
import * as React from 'react';
import { css } from '@emotion/core';

import Logo from '../../content/img/logo.svg';

const SiteNavLogoStyles = css`
  flex-shrink: 0;
  display: block;
  margin-right: 24px;
  padding: 11px 0;
  color: #fff;
  font-size: 1.7rem;
  line-height: 1em;
  font-weight: bold;
  letter-spacing: -0.5px;

  :hover {
    text-decoration: none;
  }

  img {
    display: block;
    width: auto;
    height: 60px;
  }
`;

const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

const SiteNavLogo = () => (
  <StaticQuery
    query={pageQuery}
    render={data => (
      <Link className="site-nav-logo" css={SiteNavLogoStyles} to="/">
        <img src={Logo} alt={data.site.siteMetadata.title} />
      </Link>
    )}
  />
);

export default SiteNavLogo;

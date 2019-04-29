import { graphql, StaticQuery, Link } from 'gatsby';
import * as React from 'react';
import styled from 'styled-components';

import Logo from '../../content/img/logo.svg';

const SiteNavLogoStyled = styled(Link)`
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

  :focus {
    outline: 0;
  }
  
  :focus::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    background: rgba(255, 255, 255, 0.8);
    height: 5px;
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
      <SiteNavLogoStyled className="site-nav-logo" to="/">
        <img src={Logo} alt={data.site.siteMetadata.title} />
      </SiteNavLogoStyled>
    )}
  />
);

export default SiteNavLogo;

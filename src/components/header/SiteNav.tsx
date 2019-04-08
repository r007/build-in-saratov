// tslint:disable:no-http-string
import { Link } from 'gatsby';
import * as React from 'react';
import styled from '@emotion/styled';

import SiteNavLogo from './SiteNavLogo';

const SiteNavWrapper = styled.nav`
  left: 0;
  position: fixed;
  display: block;
  top: 0;
  max-width: 15rem;
  width: 15rem;
  background: #1a1f3e;
  height: 100%;
  z-index: 950;
  padding: 1rem;
  box-sizing: border-box;
  overflow-y: auto;
  color: #bfddff;
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translate3d(0,0,0);
  transition: all .3s cubic-bezier(.645,.045,.355,1);
`;

const Wrapper = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
`;

const NavWrapper = styled.div`
  padding-bottom: 7rem;
  min-height: 100%;
  position: relative;
  box-sizing: border-box;
  overflow-y: hidden;
`;

const NavLink = styled(Link)`
  color: #bfddff;
  display: block;
  float: none;
  font-size: 20px;
  letter-spacing: .05em;
  margin: 1em 1em 1em 0;
  padding: 0;
  position: relative;

  :hover {
    text-decoration: none;
  }

  &[aria-current~="page"]::after {
    position: absolute;
    width: .8em;
    right: .5em;
  }

  &[aria-current~="page"] {
    background: #aad2ff;
    box-sizing: border-box;
    color: #1a1f3e;
    letter-spacing: .03em;
    padding: .3em 0 .4em .6em;
    width: 100%;
  }
`;

class SiteNav extends React.Component {
  render() {
    return (
      <SiteNavWrapper>
        <Wrapper>
          <NavWrapper>
            <SiteNavLogo />
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/tags/getting-started/">Getting Started</NavLink>
          </NavWrapper>
        </Wrapper>
      </SiteNavWrapper>
    );
  }
}

export default SiteNav;

// tslint:disable:no-http-string
import { Link } from 'gatsby';
import * as React from 'react';
import styled from '@emotion/styled';

import { SocialLink } from '../../styles/shared';
import config from '../../website-config';
import Facebook from '../icons/facebook';
import Twitter from '../icons/twitter';
import SubscribeModal from '../subscribe/SubscribeOverlay';
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

const SocialLinks = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  a:last-of-type {
    padding-right: 20px;
  }
`;

const SubscribeButton = styled.a`
  display: block;
  padding: 4px 10px;
  border: #fff 1px solid;
  color: #fff;
  font-size: 1.2rem;
  line-height: 1em;
  border-radius: 10px;
  opacity: 0.8;

  :hover {
    text-decoration: none;
    opacity: 1;
    cursor: pointer;
  }
`;

class SiteNav extends React.Component {
  subscribe = React.createRef<SubscribeModal>();

  openModal = () => {
    if (this.subscribe.current) {
      this.subscribe.current.open();
    }
  };

  render() {
    return (
      <SiteNavWrapper>
        <Wrapper>
          <NavWrapper>
            <SiteNavLogo />
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/tags/getting-started/">Getting Started</NavLink>

            <SocialLinks>
              {config.facebook && (
                <a
                  css={SocialLink}
                  href={config.facebook}
                  target="_blank"
                  title="Facebook"
                  rel="noopener noreferrer"
                >
                  <Facebook />
                </a>
              )}
              {config.twitter && (
                <a
                  css={SocialLink}
                  href={config.twitter}
                  title="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter />
                </a>
              )}
            </SocialLinks>
            {config.showSubscribe && (
              <SubscribeButton onClick={this.openModal}>Subscribe</SubscribeButton>
            )}
            {config.showSubscribe && <SubscribeModal ref={this.subscribe} />}
          </NavWrapper>
        </Wrapper>
      </SiteNavWrapper>
    );
  }
}

export default SiteNav;

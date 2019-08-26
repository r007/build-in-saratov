import { Link } from 'gatsby';
import * as React from 'react';
import styled from 'styled-components';

import SiteNavLogo from './SiteNavLogo';
import MobileNavigation from './MobileNavigation';
import SearchBox from '../search/SearchBox';
import BlueArrow from '../../content/img/blue-arrow.svg';
import DarkblueArrow from '../../content/img/darkblue-arrow.svg';

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
  -webkit-transform: translate3d(0, 0, 0);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  @media only screen and (max-width: 1560px) {
    width: 12rem;
  }

  @media only screen and (max-width: 1280px) {
    position: fixed;
    display: block;
    top: 85px;
    bottom: 0;
    height: auto;
    z-index: 950;
    transform: translateX(-600px);
    width: 100%;
  }
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
  letter-spacing: 0.05em;
  margin: 1em 1em 1em 0;
  padding: 0;
  position: relative;

  &:not([aria-current~='page'])::after {
    content: '';
    background: url(${BlueArrow});
    background-repeat: no-repeat;
    width: 0.8em;
    height: 0.8em;
    position: relative;
    display: inline-block;
    vertical-align: middle;
    margin-left: -10px;
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  :hover {
    text-decoration: none;

    &::after {
      margin-left: 10px;
      opacity: 1;
    }
  }

  &[aria-current~='page']::after {
    content: url(${DarkblueArrow});
    position: absolute;
    width: 0.8em;
    right: 0.5em;
  }

  &[aria-current~='page'] {
    background: #aad2ff;
    box-sizing: border-box;
    color: #1a1f3e;
    letter-spacing: 0.03em;
    padding: 0.3em 0 0.4em 0.6em;
    width: 100%;
  }
`;

const SiteNav = () => (
  <>
    <MobileNavigation />
    <SiteNavWrapper>
      <Wrapper>
        <NavWrapper>
          <SiteNavLogo />
          <NavLink title="Перейти на главную страницу" to="/">
            Главная
          </NavLink>
          <NavLink title="Прочитать последние записи в блоге" to="/articles">
            Статьи
          </NavLink>
          <NavLink title="Узнать больше об этом сайте" to="/about">
            О сайте
          </NavLink>
          <NavLink title="Связаться со мной" to="/contact">
            Обратная связь
          </NavLink>
          <SearchBox />
        </NavWrapper>
      </Wrapper>
    </SiteNavWrapper>
  </>
);

export default SiteNav;

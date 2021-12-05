import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import styled from 'styled-components';
import iconFromString from '../utils/iconFromString';

const Wrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-around;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-top: 1px solid #f6edfa;
  background: #ffffff;
  height: 60px;
  padding-bottom: 0;

  @media (min-width: 801px) {
    display: none;
  }
`;

const Link = styled(GatsbyLink)`
  border-radius: 2px;
  font-size: 0.7rem;
  flex-shrink: 0;
  line-height: 1;
  width: 82px;
  padding: 0.4rem;
  text-decoration: none;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;

  :hover,
  &[aria-current~='page'] {
    text-decoration: none;
    font-weight: bold;

    svg {
      fill: #ffef83 !important;
    }
  }

  & svg {
    margin: 0 auto;
    stroke-width: 2;
    stroke: #164194;

    path,
    line,
    polygon {
      transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
`;

const getProps = ({ isPartiallyCurrent }) => ({
  ...(isPartiallyCurrent
    ? {
        'data-active': true,
      }
    : {}),
});

const MobileNavItem = ({ linkTo, label, icon }) => (
  <Link getProps={getProps} to={linkTo}>
    {iconFromString(icon, { width: '32px', fill: 'none' })}
    <div>{label}</div>
  </Link>
);

const MobileNavigation = () => (
  <Wrapper>
    <MobileNavItem linkTo="/" label="Главная" icon="Home" />
    <MobileNavItem linkTo="/articles/" label="Статьи" icon="Article" />
    <MobileNavItem linkTo="/about/" label="О сайте" icon="CircleQuestion" />
    <MobileNavItem linkTo="/contact" label="Контакт" icon="Contact" />
  </Wrapper>
);

export default MobileNavigation;

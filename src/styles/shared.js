import { css } from '@emotion/core';
import styled, { css as styledCss } from 'styled-components';

export const outer = styledCss`
  position: relative;
  padding: 3rem 3rem 0 20rem;

  @media only screen and (max-width: 1560px) {
    padding: 1rem 2rem 0 15rem;
  }

  @media only screen and (max-width: 1280px) {
    padding: 2rem 3rem 0 3.4rem;
  }

  @media only screen and (max-width: 460px) {
    padding: 1rem 1rem 0 1rem;
  }
`;

export const PageTitle = styled.h1`
  color: #fff;
  margin: 0;

  @media only screen and (max-width: 1280px) {
    font-size: 1.575rem;
  }
`;

export const SiteDescription = styled.h2`
  margin: 0;
  font-size: 2.2rem;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

export const PostFeed = css`
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

export const SiteHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

import styled, { css } from 'styled-components';

export const outer = css`
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
  z-index: 1;

  @media only screen and (max-width: 1280px) {
    font-size: 1.575rem;
  }
`;

export const PageDescription = styled.h2`
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  margin: 0;
  z-index: 1;

  @media (max-width: 500px) {
    font-size: 1.2rem;
    line-height: 1.3em;
  }
`;

export const PostFeed = styled.div`
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

import styled, { css } from 'styled-components';
import { Link } from 'gatsby';

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
  position: relative;
  color: #fff;
  margin: 0;
  z-index: 1;

  @media only screen and (max-width: 1280px) {
    font-size: 1.575rem;
  }
`;

export const PageDescription = styled.h2`
  position: relative;
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

export const HeaderLink = styled(Link)`
  color: #ffffff;
  word-wrap: break-word;
  text-decoration: none;
  padding-bottom: 0;
  border-bottom: 2px solid #fff;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    background: #1a1f3e;
    border-color: #1a1f3e;
  }
`;

export const PostFeed = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;

  @media (min-width: 795px) {
    margin: 0 -20px;
  }
`;

export const SiteHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const PostsGrid = styled.main`
  @media (min-width: 795px) and (max-width: 1280px) {
    .post-card:nth-of-type(6n + 1):not(.no-image) {
      flex: 1 1 100%;
      flex-direction: column;
      background-color: #f0f0f0;
      padding: 20px;

      .post-card-image-wrapper {
        position: relative;
        flex: 1 1 auto;
        order: 1;
      }

      .post-card-content {
        order: 2;
      }
    }
  }

  @media (min-width: 1281px) {
    .post-card:nth-of-type(6n + 1):not(.no-image) {
      flex: 1 1 100%;
      flex-direction: row;
      background-color: #f0f0f0;
      padding: 35px;

      .post-card-link {
        flex-direction: row;
      }

      .post-card-image-wrapper {
        position: relative;
        flex: 1 1 auto;
        order: 2;
      }

      .post-card-image {
        position: absolute;
        width: 100%;
        height: 100%;

        :after {
          content: none;
        }
      }

      .post-card-content {
        padding: 0 35px 0 0;
        flex: 0 1 40%;
        order: 1;

        :after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 0px;
          height: 8px;
          background: #164194;
          transform: scaleX(0.25);
          transform-origin: 0 0;
          transition: all 0.4s;
        }
      }

      :hover .post-card-content:after {
        transition-duration: 0.2s;
        transform: scaleX(0.9);
        background: #ad005f;
      }

      h2 {
        font-size: 1.3rem;
      }

      p {
        font-size: 0.9rem;
        line-height: 1.55em;
      }
    }
  }
`;

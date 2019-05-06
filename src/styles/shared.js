import styled, { css } from 'styled-components';
import IndexLayout from '../layouts';

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

export const PostsGrid = styled(IndexLayout)`
  @media (min-width: 795px) and (max-width: 1280px) {
    .post-card:nth-of-type(6n + 1):not(.no-image) {
      flex: 1 1 100%;
      flex-direction: column;
      background-color: #f0f0f0;
      padding: 20px;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-image-link {
      position: relative;
      flex: 1 1 auto;
      order: 1;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-content {
      order: 2;
    }
  }

  @media (min-width: 1281px) {
    .post-card:nth-of-type(6n + 1):not(.no-image) {
      flex: 1 1 100%;
      flex-direction: row;
      background-color: #f0f0f0;
      padding: 35px;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-image-link {
      position: relative;
      flex: 1 1 auto;
      order: 2;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-image {
      position: absolute;
      width: 100%;
      height: 100%;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-content {
      flex: 0 1 40%;
      order: 1;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) h2 {
      font-size: 1.3rem;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) p {
      font-size: 0.9rem;
      line-height: 1.55em;
    }

    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-content-link,
    .post-card:nth-of-type(6n + 1):not(.no-image) .post-card-meta {
      padding: 0 35px 0 0;
    }
  }
`;

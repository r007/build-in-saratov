import styled, { css } from 'styled-components';

export const PostHeader = styled.section`
  padding-top: 2.5rem;
  padding-bottom: 3rem;
  box-sizing: border-box;
  background: #164194;
  width: 100vw;

  header {
    width: 90%;
  }

  @media only screen and (max-width: 1560px) {
    padding-top: 1.5rem;
    padding-bottom: 2rem;
  }

  ${props =>
    props.bgImage &&
    css`
      :before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 66%;
        height: 95%;
        background-image: radial-gradient(ellipse closest-side, rgba(22, 65, 148, 0.4), #164194),
          url(${props.bgImage});
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.9;
      }
    `}
`;

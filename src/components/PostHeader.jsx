import styled, { css } from 'styled-components';

const PostHeader = styled.section`
  padding-top: 2.5rem;
  padding-bottom: 3rem;
  box-sizing: border-box;
  background: #164194;
  color: #ffffff;
  width: 100vw;

  header {
    width: 90%;
  }

  @media only screen and (max-width: 1560px) {
    padding-top: 1.5rem;
    padding-bottom: 2rem;
  }

  ${props =>
    props.fullHeight &&
    css`
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding-top: 0;

      @media only screen and (max-width: 800px) {
        height: calc(100vh - 60px);
      }
    `}

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

export default PostHeader;

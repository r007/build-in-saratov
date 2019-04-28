import * as React from 'react';
import styled from 'styled-components';

const PostFullFoot = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  padding: 3rem 3rem 0 20rem;
`;

const PostFullFooter = ({ children }) => {
  return (
    <PostFullFoot>{children}</PostFullFoot>
  );
};

export default PostFullFooter;

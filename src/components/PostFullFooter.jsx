import * as React from 'react';
import styled from 'styled-components';
import { outer } from '../styles/shared';

const PostFullFoot = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 auto;
  ${outer}
`;

const PostFullFooter = ({ children }) => <PostFullFoot>{children}</PostFullFoot>;

export default PostFullFooter;

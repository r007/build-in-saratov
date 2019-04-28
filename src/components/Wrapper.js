import * as React from 'react';
import styled from '@emotion/styled';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Wrapper = ({ children, className }) => {
  return (
    <StyledWrapper className={className}>{children}</StyledWrapper>
  );
};

export default Wrapper;

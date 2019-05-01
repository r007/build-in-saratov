import * as React from 'react';
import styled from 'styled-components';

const StyledLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  letter-spacing: 0.32px;
  color: #565656;
  font-weight: 400;
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: 0.5rem;
  line-height: 1rem;
`;

const Label = ({ children, ...rest }) => {
  return (
    <StyledLabel {...rest}>
      {children}
    </StyledLabel>
  );
};

export default Label;

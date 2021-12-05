import React from 'react';
import styled from 'styled-components';

const HTag = styled.h2`
  margin-top: 0.8rem;
  margin-bottom: 0.5rem;
  text-align: center;
  font-weight: 300;
  max-width: 100%;
`;

const Underline = styled.span`
  display: block;
  height: 2px;
  margin: 24px auto 0px;
  width: 30px;
  background-color: #ad005f;
`;

const Heading = ({ children }) => (
  <HTag>
    {children}
    <Underline />
  </HTag>
);

export default Heading;

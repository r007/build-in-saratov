import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  max-width: 1200px;

  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
`;

const IconCalloutGroup = ({ children }) => <Container>{children}</Container>;

IconCalloutGroup.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IconCalloutGroup;

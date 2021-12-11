import React from 'react';
import PropTypes from 'prop-types';
import { Link as GatsbyLink } from 'gatsby';
import styled from 'styled-components';

import iconFromString from './utils/iconFromString';
import Icon from './Icon';

const IconLink = styled(GatsbyLink)`
  color: #15171a;
  display: block;
  text-decoration: none;
`;

const Paragraph = styled.p`
  color: #15171a;
  font-size: 0.7rem;
  line-height: ${24 / 16};
  margin-bottom: 23px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 11px;

  @media (max-width: 480px) {
    display: none;
  }
`;

const Title = styled.h3`
  font-size: 1rem;
  margin-top: 33px;
  transition: color 250ms ease-in-out;

  @media (max-width: 480px) {
    font-size: 14px;
    margin-top: 13px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  text-align: center;

  &:hover .IconCallout-icon {
    transform: translateY(-5px);
  }

  @media (max-width: 480px) {
    .IconCallout-icon {
      font-size: 71px !important;
    }
  }

  @media (min-width: 480px) and (max-width: 960px) {
    .IconCallout-icon {
      font-size: 80px !important;
    }
  }

  @media (max-width: 960px) {
    flex: 1 1 calc(100% / 2);

    :last-child {
      margin-top: 60px;
    }

    :nth-last-child(2) {
      margin-top: 60px;
    }
  }
`;

const styles = {
  icon: {
    fill: 'none',
    stroke: '#164194',
    strokeWidth: '2',
    fontSize: '96px',
    transition: 'transform 250ms ease-in-out',
  },
};

const IconCallout = ({ iconName, title, copy, url }) => (
  <Container className="IconCallout">
    <IconLink to={url}>
      {iconFromString(iconName, {
        style: styles.icon,
        ariaHidden: true,
        className: 'IconCallout-icon',
      })}

      <Title>{title}</Title>

      <Paragraph className="IconCallout-copy">{copy}</Paragraph>
    </IconLink>
  </Container>
);

IconCallout.propTypes = {
  iconName: PropTypes.oneOf(Object.keys(Icon)).isRequired,
  title: PropTypes.string.isRequired,
  copy: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default IconCallout;

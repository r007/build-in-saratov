import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SocialIconButton from './SocialIconButton';

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const SocialShare = ({ networks, headingText, onClick }) => (
  <Wrapper className="SocialShare" role="complementary">
    {headingText && <h3 className="ShareHeading">{headingText}</h3>}

    {Object.keys(networks).map((network) => (
      <SocialIconButton
        key={networks[network].name}
        className={networks[network].name}
        network={networks[network].name}
        href={networks[network].href}
        aria-label={networks[network].label}
        onClick={onClick}
      />
    ))}
  </Wrapper>
);

SocialShare.propTypes = {
  networks: PropTypes.objectOf(PropTypes.object).isRequired,
  headingText: PropTypes.string,
  onClick: PropTypes.func,
};

SocialShare.defaultProps = {
  headingText: 'Share this post:',
  onClick: null,
};

export default SocialShare;

import React from 'react';
import PropTypes from 'prop-types';
import SocialIconButton from './SocialIconButton';

const SocialShare = ({ networks, headingText, onClick }) => (
  <div className="SocialShare" role="complementary">
    {headingText && <h3 className="ShareHeading">{headingText}</h3>}

    {Object.keys(networks).map(network => (
      <SocialIconButton
        key={networks[network].name}
        className={networks[network].name}
        network={networks[network].name}
        href={networks[network].href}
        aria-label={networks[network].label}
        onClick={onClick}
      />
    ))}
  </div>
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

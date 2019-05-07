import styled from 'styled-components';
import { OutboundLink } from 'gatsby-plugin-google-gtag';

const SocialLink = styled(OutboundLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 10px;
  color: #fff;
  opacity: 0.8;

  :hover {
    opacity: 1;
  }

  svg {
    height: 1.8rem;
    fill: #fff;
  }
`;

export default SocialLink;

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { switchProp } from 'styled-tools';
import cn from 'classnames';
import { Link as GatsbyLink } from 'gatsby';
import propTypes from './utils/propTypes';

const colors = {
  // Background colors
  bgPrimary: '#164194',
  textPrimary: '#ffffff',
  borderPrimary: '#000000',
  bgSecondary: '#efefef',
  textSecondary: '#bfddff',
  accent: '#1a1f3e',
  bgAccent: 'rgba(126, 130, 126, 0.1)',
};

const borderStyle = css`
  box-shadow: none;
`;

const roundedStyle = css`
  border-radius: 100px;
  padding-left: ${21 / 9}em;
  padding-right: ${21 / 9}em;
  padding-top: ${12 / 9}em;

  ${switchProp('size', {
    tiny: css`
      padding-bottom: ${9 / 9}em;
    `,

    small: css`
      padding-bottom: ${10 / 9}em;
    `,

    medium: css`
      padding-bottom: ${9 / 9}em;
    `,

    large: css`
      padding-bottom: ${10 / 9}em;
    `,

    huge: css`
      padding-bottom: ${9 / 9}em;
    `,
  })}
`;

const fullStyle = css`
  display: block;
  width: 100%;
`;

const ButtonLink = styled(GatsbyLink)`
  appearance: none;
  backface-visibility: hidden;
  border: 0;
  border-radius: 0;
  cursor: pointer;
  display: inline-flex;
  flex-shrink: 0;
  -moz-box-align: center;
  align-items: center;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.025em;
  overflow: hidden;
  padding-left: ${30 / 17}em;
  padding-right: ${30 / 17}em;
  text-align: center;
  text-decoration: none;
  text-overflow: ellipsis;
  transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0s;
  vertical-align: middle;
  white-space: nowrap;
  position: relative;
  
  :before,
  :after {
    box-sizing: border-box;
    position: absolute;
    content: '';
    transition: 70ms cubic-bezier(0, 0, 0.38, 0.9);
  }
  
  :before {
    top: calc(-1px + 3px);
    left: 2px;
    width: calc(100% + (2 * 1px) - (2 * 3px));
    height: calc(100% + (2 * 1px) - (2 * 3px));
    border: 1px solid transparent;
  }
  
  :after {
    top: -1px;
    left: -1px;
    height: calc(100% + 2 * 1px);
    width: calc(100% + 2 * 1px);
    border: 3px solid transparent;
  }

  :active,
  :hover,
  :focus {
    text-decoration: none;
  }

  ${switchProp('color', {
    primary: css`
      background-color: ${colors.bgPrimary};
      color: ${colors.textPrimary};

      :focus,
      :hover,
      :active {
        color: ${colors.textSecondary};
        background-color: ${colors.accent};
      }
  
      :focus::before {
        border-color: #ffffff;
      }
  
      :focus::after {
        border-color: ${colors.accent};
      }
    `,

    white: css`
      background-color: ${colors.bgPrimary};
      background-size: 4rem 4rem;
      color: ${colors.borderPrimary};
      box-shadow: 0 0 0 2px ${colors.borderPrimary} inset;

      :focus,
      :hover,
      :active {
        color: ${colors.textPrimary};
        background-color: ${colors.bgAccent};
      }
    `,

    transparent: css`
      background-color: transparent;
      color: ${colors.textOverlay};
      box-shadow: 0 0 0 2px ${colors.bgPrimary} inset;

      :focus,
      :hover,
      :active {
        background-color: transparent;
        color: ${colors.textPrimary};
      }
    `,
  })}

  ${switchProp('size', {
    tiny: css`
      font-size: 9px;
      padding-bottom: ${9 / 9}em;
      padding-left: ${19 / 9}em;
      padding-right: ${19 / 9}em;
      padding-top: ${12 / 9}em;
    `,

    small: css`
      font-size: 11px;
      padding-bottom: ${15 / 11}em;
      padding-top: ${18 / 11}em;
    `,

    medium: css`
      font-size: 0.6rem;
      padding-bottom: ${13 / 11}em;
      padding-top: ${13 / 11}em;
    `,

    large: css`
      font-size: 0.725rem;
      padding-bottom: ${15 / 11}em;
      padding-top: ${15 / 11}em;
    `,

    huge: css`
      font-size: 0.9rem;
      padding-bottom: ${23 / 15}em;
      padding-top: ${28 / 15}em;
    `,
  })}
    
  ${props => props.rounded && roundedStyle}
  ${props => props.full && fullStyle}
  ${props => !props.border && borderStyle}
`;

ButtonLink.defaultProps = {};

/**
 * Button component
 *
 * @usage
 * <Button href="/foo">Bar</Button>
 */
function Button({
  href,
  children,
  onClick,
  color,
  size,
  rounded,
  full,
  border,
  customStyles,
  className,
  ...rest
}) {
  return (
    <ButtonLink
      className={cn('Button', className)}
      style={customStyles}
      to={href}
      onClick={onClick}
      color={color}
      size={size}
      rounded={rounded ? 1 : undefined}
      full={full ? 1 : undefined}
      border={border ? 1 : undefined}
      {...rest}
    >
      {children}
    </ButtonLink>
  );
}

Button.propTypes = {
  /**
   * Pass an href prop to make the button an `a` element instead of a `button`
   */
  href: PropTypes.string,

  /**
   * Content for the button
   */
  children: PropTypes.node.isRequired,

  /**
   * Function to run when the button is clicked
   */
  onClick: PropTypes.func,

  /**
   * Color of the button
   */
  color: PropTypes.oneOf(['primary', 'white', 'transparent']),

  /**
   * Size of the button
   * tiny: 30 px tall
   * small: 44 px tall
   * medium: 60 px tall
   * large: 66 px tall
   * huge: 72 px tall
   */
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'huge']),

  /**
   * Use a rounded button
   */
  rounded: PropTypes.bool,

  /**
   * Allow button to span available width
   */
  full: PropTypes.bool,

  /**
   * Special styles passed in props
   */
  customStyles: propTypes.style,

  /**
   * Use a border
   */
  border: PropTypes.bool,

  /**
   * Add classname to button
   */
  className: PropTypes.string,
};

Button.defaultProps = {
  href: null,
  onClick: null,
  color: 'primary',
  size: 'medium',
  rounded: false,
  full: false,
  border: false,
  customStyles: null,
  className: null,
};

export default Button;

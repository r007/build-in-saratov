import React from 'react';
import PropTypes from 'prop-types';
import assign from 'object-assign';
import classNames from 'classnames';

function getIconDimensions(height, width) {
  if (height && width) {
    return { height, width };
  }

  if (!height && width) {
    return { height: width, width };
  }

  if (height && !width) {
    return { height, width: height };
  }

  return {
    height: '1em',
    width: '1em',
  };
}

function getIconAriaData(label) {
  const aria = {};

  if (label) {
    aria['aria-label'] = label;
  } else {
    aria['aria-hidden'] = 'true';
  }

  return aria;
}

const Icon = ({ children, className, fill, height, label, viewBox, width, style }) => {
  const dimensions = getIconDimensions(height, width);
  const aria = getIconAriaData(label);

  const iconStyle = {
    display: 'inline-block',
    fill: fill || 'currentColor',
    height: dimensions.height,
    lineHeight: 1,
    verticalAlign: 'middle',
    width: dimensions.width,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('Icon', className)}
      style={style ? assign({}, iconStyle, style) : iconStyle}
      viewBox={viewBox}
      role={label ? 'img' : null}
      {...aria}
    >
      {children}
    </svg>
  );
};

Icon.propTypes = {
  children: PropTypes.node.isRequired,
  viewBox: PropTypes.string,
  className: PropTypes.string,
  fill: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object]),
};

Icon.defaultProps = {
  viewBox: '0 0 32 32',
  className: '',
  fill: '',
  width: 0,
  height: 0,
  label: '',
  style: {},
};

// Interface

const Configure = (props) => (
  <Icon {...props} viewBox="0 0 24 24" aria-label="Configure">
    <path d="M16,15 C20.0089021,14.9354541 23,11.9673591 23,8 C23,4.98813056 22.0029673,5.9851632 21,7 C20.0089021,7.97922849 18,10 18,10 L14,6 C14,6 16.0207715,3.99109792 17,3 C18.0148368,1.99703264 18.0148368,1 16,1 C12.0326409,0.999999999 9.05307486,3.99109792 9,8 C9.04154304,8.97626113 9,11 9,11 C7.11486635,12.8970031 4.65923194,15.3526375 3,17 C0.0682492584,19.9436202 4.05637975,23.9317507 7,21 C8.65052042,19.3376102 11.1126942,16.8754364 13,15 C13,15 15.0237389,14.958457 16,15 Z" />
  </Icon>
);

const Inspect = (props) => (
  <Icon {...props} aria-label="Inspect" viewBox="0 0 24 24">
    <path d="M5.5,21 C7.98528137,21 10,18.9852814 10,16.5 C10,14.0147186 7.98528137,12 5.5,12 C3.01471863,12 1,14.0147186 1,16.5 C1,18.9852814 3.01471863,21 5.5,21 Z M1,16 L1,7 L1,6.5 C1,4.01471863 3.01471863,2 5.5,2 L6,2 M23,16 L23,7 L23,6.5 C23,4.01471863 20.9852814,2 18.5,2 L18,2 M18.5,21 C20.9852814,21 23,18.9852814 23,16.5 C23,14.0147186 20.9852814,12 18.5,12 C16.0147186,12 14,14.0147186 14,16.5 C14,18.9852814 16.0147186,21 18.5,21 Z M10,17 C10,17 10,15 12,15 C14,15 14,17 14,17" />
  </Icon>
);

const Send = (props) => (
  <Icon {...props} aria-label="Send" viewBox="0 0 24 24">
    <path d="M22,3 L2,11 L20.5,19 L22,3 Z M10,20.5 L13,16 M15.5,9.5 L9,14 L9.85884537,20.0119176 C9.93680292,20.5576204 10.0751625,20.5490248 10.1651297,20.009222 L11,15 L15.5,9.5 Z" />
  </Icon>
);

const Deploy = (props) => (
  <Icon {...props} aria-label="Deploy" viewBox="0 0 24 24">
    <path d="M23,1 C23,1 16.471872,0.541707069 14,3 C13.9767216,3.03685748 10,7 10,7 L5,8 L2,10 L10,14 L14,22 L16,19 L17,14 C17,14 20.9631426,10.0232786 21,10 C23.4582929,7.5281282 23,1 23,1 Z M17,8 C16.4475,8 16,7.5525 16,7 C16,6.4475 16.4475,6 17,6 C17.5525,6 18,6.4475 18,7 C18,7.5525 17.5525,8 17,8 Z M7,17 C6,16 4,16 3,17 C2,18 2,22 2,22 C2,22 6,22 7,21 C8,20 8,18 7,17 Z" />
  </Icon>
);

const Vk = (props) => (
  <Icon {...props} aria-label="Vk" viewBox="0 0 2048 1792">
    <path d="M1981 520q23 64-150 294-24 32-65 85-40 51-55 72t-30.5 49.5-12 42 13 34.5 32.5 43 57 53q4 2 5 4 141 131 191 221 3 5 6.5 12.5t7 26.5-.5 34-25 27.5-59 12.5l-256 4q-24 5-56-5t-52-22l-20-12q-30-21-70-64t-68.5-77.5-61-58-56.5-15.5q-3 1-8 3.5t-17 14.5-21.5 29.5-17 52-6.5 77.5q0 15-3.5 27.5t-7.5 18.5l-4 5q-18 19-53 22h-115q-71 4-146-16.5t-131.5-53-103-66-70.5-57.5l-25-24q-10-10-27.5-30t-71.5-91-106-151-122.5-211-130.5-272q-6-16-6-27t3-16l4-6q15-19 57-19l274-2q12 2 23 6.5t16 8.5l5 3q16 11 24 32 20 50 46 103.5t41 81.5l16 29q29 60 56 104t48.5 68.5 41.5 38.5 34 14 27-5q2-1 5-5t12-22 13.5-47 9.5-81 0-125q-2-40-9-73t-14-46l-6-12q-25-34-85-43-13-2 5-24 16-19 38-30 53-26 239-24 82 1 135 13 20 5 33.5 13.5t20.5 24 10.5 32 3.5 45.5-1 55-2.5 70.5-1.5 82.5q0 11-1 42t-.5 48 3.5 40.5 11.5 39 22.5 24.5q8 2 17 4t26-11 38-34.5 52-67 68-107.5q60-104 107-225 4-10 10-17.5t11-10.5l4-3 5-2.5 13-3 20-.5 288-2q39-5 64 2.5t31 16.5z" />
  </Icon>
);

const Facebook = (props) => (
  <Icon {...props} aria-label="FacebookOption" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6845806,22"
    />
  </Icon>
);

const Globe = (props) => (
  <Icon {...props} aria-label="Globe" viewBox="0 0 24 24">
    <path d="M12,23 C18.0751322,23 23,18.0751322 23,12 C23,5.92486775 18.0751322,1 12,1 C5.92486775,1 1,5.92486775 1,12 C1,18.0751322 5.92486775,23 12,23 Z M12,23 C15,23 16,18 16,12 C16,6 15,1 12,1 C9,1 8,6 8,12 C8,18 9,23 12,23 Z M2,16 L22,16 M2,8 L22,8" />
  </Icon>
);

const Inf = (props) => (
  <Icon {...props} aria-label="Infinity" viewBox="0 0 24 24">
    <path d="M13 14.5s2 3 5 3 5.5-2.463 5.5-5.5S21 6.5 18 6.5c-5 0-7 11-12 11C2.962 17.5.5 15.037.5 12S3 6.5 6 6.5s4.5 3.5 4.5 3.5" />
  </Icon>
);

// Brand icons

const Quora = (props) => (
  <Icon {...props} aria-label="Quora" viewBox="0 0 448 512">
    <path
      fill="currentColor"
      d="M440.5 386.7h-29.3c-1.5 13.5-10.5 30.8-33 30.8-20.5 0-35.3-14.2-49.5-35.8 44.2-34.2 74.7-87.5 74.7-153C403.5 111.2 306.8 32 205 32 105.3 32 7.3 111.7 7.3 228.7c0 134.1 131.3 221.6 249 189C276 451.3 302 480 351.5 480c81.8 0 90.8-75.3 89-93.3zM297 329.2C277.5 300 253.3 277 205.5 277c-30.5 0-54.3 10-69 22.8l12.2 24.3c6.2-3 13-4 19.8-4 35.5 0 53.7 30.8 69.2 61.3-10 3-20.7 4.2-32.7 4.2-75 0-107.5-53-107.5-156.7C97.5 124.5 130 71 205 71c76.2 0 108.7 53.5 108.7 157.7.1 41.8-5.4 75.6-16.7 100.5z"
    />
  </Icon>
);

const Pinterest = (props) => (
  <Icon {...props}>
    <path d="M16 2.138c-7.656 0-13.863 6.206-13.863 13.863 0 5.875 3.656 10.887 8.813 12.906-0.119-1.094-0.231-2.781 0.050-3.975 0.25-1.081 1.625-6.887 1.625-6.887s-0.412-0.831-0.412-2.056c0-1.925 1.119-3.369 2.506-3.369 1.181 0 1.756 0.887 1.756 1.95 0 1.188-0.756 2.969-1.15 4.613-0.331 1.381 0.688 2.506 2.050 2.506 2.462 0 4.356-2.6 4.356-6.35 0-3.319-2.387-5.638-5.787-5.638-3.944 0-6.256 2.956-6.256 6.019 0 1.194 0.456 2.469 1.031 3.163 0.113 0.137 0.131 0.256 0.094 0.4-0.106 0.438-0.338 1.381-0.387 1.575-0.063 0.256-0.2 0.306-0.463 0.188-1.731-0.806-2.813-3.337-2.813-5.369 0-4.375 3.175-8.387 9.156-8.387 4.806 0 8.544 3.425 8.544 8.006 0 4.775-3.012 8.625-7.194 8.625-1.406 0-2.725-0.731-3.175-1.594 0 0-0.694 2.644-0.863 3.294-0.313 1.206-1.156 2.712-1.725 3.631 1.3 0.4 2.675 0.619 4.106 0.619 7.656 0 13.863-6.206 13.863-13.863 0-7.662-6.206-13.869-13.863-13.869z" />
  </Icon>
);

const Reddit = (props) => (
  <Icon {...props}>
    <path d="M32 15.6c0-2-1.7-3.7-3.7-3.7-0.9 0-1.8 0.3-2.4 0.9-2.4-1.5-5.6-2.5-9.1-2.6l2.1-5.9 5.2 1.2c0 1.6 1.4 3 3 3 1.7 0 3-1.3 3-3s-1.4-3-3-3c-1.3 0-2.3 0.8-2.8 1.9l-6.2-1.4-2.6 7.3c-3.7 0.1-7 1.1-9.5 2.6-0.6-0.6-1.4-0.9-2.3-0.9-2 0-3.7 1.6-3.7 3.7 0 1.3 0.6 2.4 1.7 3.1-0.1 0.4-0.1 0.7-0.1 1.1 0 5.3 6.4 9.6 14.4 9.6 7.9 0 14.4-4.3 14.4-9.6 0-0.4 0-0.7-0.1-1.1 1-0.7 1.7-1.9 1.7-3.2zM27.1 3.7c1 0 1.9 0.8 1.9 1.8s-0.8 1.8-1.9 1.8c-1 0-1.9-0.8-1.9-1.8 0.1-1 0.9-1.8 1.9-1.8zM2 17.5c-0.5-0.5-0.9-1.2-0.9-1.9 0-1.4 1.1-2.5 2.5-2.5 0.5 0 1 0.2 1.4 0.4-1.4 1.2-2.4 2.5-3 4zM9.1 18.1c0-1.2 1-2.3 2.3-2.3s2.3 1 2.3 2.3c0 1.2-1 2.3-2.3 2.3-1.2 0-2.3-1-2.3-2.3zM21.3 24.2c-0.1 0.1-1.7 1.7-5.4 1.7s-5.2-1.7-5.2-1.7c-0.2-0.2-0.2-0.6 0.1-0.8 0.2-0.2 0.6-0.2 0.8 0.1 0 0 1.3 1.3 4.4 1.3s4.5-1.4 4.5-1.4c0.2-0.2 0.6-0.2 0.8 0s0.2 0.6 0 0.8zM20.9 20.4c-1.3 0-2.3-1-2.3-2.3 0-1.2 1-2.3 2.3-2.3s2.3 1 2.3 2.3c-0.1 1.3-1.1 2.3-2.3 2.3zM29.9 17.6c-0.5-1.5-1.6-2.9-3.1-4 0.4-0.3 0.9-0.5 1.4-0.5 1.4 0 2.5 1.1 2.5 2.5 0.1 0.8-0.2 1.5-0.8 2z" />
  </Icon>
);

const Twitter = (props) => (
  <Icon {...props}>
    <path d="M32 7.075c-1.175 0.525-2.444 0.875-3.769 1.031 1.356-0.813 2.394-2.1 2.887-3.631-1.269 0.75-2.675 1.3-4.169 1.594-1.2-1.275-2.906-2.069-4.794-2.069-3.625 0-6.563 2.938-6.563 6.563 0 0.512 0.056 1.012 0.169 1.494-5.456-0.275-10.294-2.888-13.531-6.862-0.563 0.969-0.887 2.1-0.887 3.3 0 2.275 1.156 4.287 2.919 5.463-1.075-0.031-2.087-0.331-2.975-0.819 0 0.025 0 0.056 0 0.081 0 3.181 2.263 5.838 5.269 6.437-0.55 0.15-1.131 0.231-1.731 0.231-0.425 0-0.831-0.044-1.237-0.119 0.838 2.606 3.263 4.506 6.131 4.563-2.25 1.762-5.075 2.813-8.156 2.813-0.531 0-1.050-0.031-1.569-0.094 2.913 1.869 6.362 2.95 10.069 2.95 12.075 0 18.681-10.006 18.681-18.681 0-0.287-0.006-0.569-0.019-0.85 1.281-0.919 2.394-2.075 3.275-3.394z" />
  </Icon>
);

const FacebookMessenger = (props) => (
  <Icon {...props}>
    <path d="M16 0c-8.8 0-16 6.6-16 14.8 0 4.7 2.3 8.8 5.9 11.5v5.7l5.5-3c1.5 0.4 3 0.6 4.6 0.6 8.8 0 16-6.6 16-14.8s-7.2-14.8-16-14.8zM17.7 19.9l-4.1-4.3-8 4.4 8.7-9.2 4.1 4.3 8-4.4-8.7 9.2z" />
  </Icon>
);

const Whatsapp = (props) => (
  <Icon {...props}>
    <path d="M1.2 15.9c0 2.6 0.7 5.2 2 7.4l-2.1 7.7 7.9-2.1c2.2 1.2 4.6 1.8 7.1 1.8v0c8.2 0 14.9-6.7 14.9-14.9 0-4-1.5-7.7-4.4-10.5-2.8-2.8-6.6-4.3-10.5-4.3-8.2 0-14.9 6.7-14.9 14.9zM5.9 22.9l-0.3-0.5c-1.2-2-1.9-4.2-1.9-6.6 0-6.8 5.5-12.4 12.4-12.4 3.3 0 6.4 1.3 8.7 3.6s3.6 5.4 3.6 8.7c0 6.8-5.5 12.4-12.4 12.4v0c-2.2 0-4.4-0.6-6.3-1.7l-0.5-0.3-4.7 1.2 1.4-4.4zM16.1 30.7v0 0c0 0 0 0 0 0z" />
    <path d="M12.3 9.6c-0.3-0.6-0.6-0.6-0.8-0.6s-0.5 0-0.7 0c-0.2 0-0.7 0.1-1 0.5s-1.3 1.3-1.3 3.1c0 1.8 1.3 3.6 1.5 3.8s2.6 4.1 6.3 5.6c3.1 1.2 3.8 1 4.5 0.9s2.2-0.9 2.5-1.8c0.3-0.9 0.3-1.6 0.2-1.8s-0.3-0.2-0.7-0.4c-0.4-0.2-2.2-1.1-2.5-1.2s-0.6-0.2-0.8 0.2c-0.2 0.4-1 1.2-1.2 1.5-0.2 0.2-0.4 0.3-0.8 0.1s-1.6-0.6-3-1.8c-1.1-1-1.9-2.2-2.1-2.6s0-0.6 0.2-0.8c0.2-0.2 0.4-0.4 0.6-0.7 0.2-0.2 0.2-0.4 0.4-0.6 0.1-0.2 0.1-0.5 0-0.7-0.3-0.1-1-1.9-1.3-2.7z" />
  </Icon>
);

const WeChat = (props) => (
  <Icon {...props} viewBox="0 0 261 225">
    <path d="M181 74c-24 1-45 9-62 25a74 74 0 0 0-23 63l-27-3a17 17 0 0 0-9 1l-26 16 5-21c1-5 1-8-4-11C6 123-6 93 3 61c8-29 29-47 58-56 38-13 82 0 105 31a72 72 0 0 1 15 38zM70 64c0-6-5-11-11-11a11 11 0 0 0-11 10 11 11 0 0 0 10 12 11 11 0 0 0 12-11zm58-11a11 11 0 0 0-11 11 11 11 0 0 0 11 11 11 11 0 1 0 0-22z" />
    <path d="M236 225c-8-4-15-9-23-9s-15 3-23 4c-23 2-45-4-62-21-34-30-29-78 10-103 34-23 84-15 109 16 21 27 18 64-8 86-7 7-10 12-5 21l2 6zm-88-85a9 9 0 1 0 0-18 9 9 0 0 0-9 10 9 9 0 0 0 9 8zm57-18a9 9 0 0 0-9 9 9 9 0 0 0 8 9 9 9 0 0 0 9-8 9 9 0 0 0-8-10z" />
  </Icon>
);

const Email = (props) => (
  <Icon {...props}>
    <path d="M0 8.023v17.031c0 0.18 0.188 0.359 0.188 0.539l10.354-9.323-10.542-8.247zM32 25.771v-17.57l-10.354 8.068 10.354 9.502zM30.306 5.333h-28.235c-0.565 0-1.131 0.359-1.506 0.716l14.871 11.653c0.377 0.359 0.94 0.359 1.506 0l14.871-11.653c-0.379-0.357-0.942-0.716-1.508-0.716zM14.306 19.138l-2.26-1.794-10.352 9.323h28.988l-10.354-9.502-2.26 1.792c-0.565 0.359-1.317 0.716-1.883 0.716-0.752 0.181-1.316-0.178-1.881-0.535v0z" />
  </Icon>
);

const Article = (props) => (
  <Icon {...props} aria-label="Article" viewBox="0 0 24 24">
    <path d="M16,7 L19,7 L19,11 L16,11 L16,7 Z M9,15 L20,15 M9,11 L13,11 M9,7 L13,7 M6,18.5 C6,19.8807119 4.88071187,21 3.5,21 C2.11928813,21 1,19.8807119 1,18.5 L1,7 L6.02493781,7 M6,18.5 L6,3 L23,3 L23,18.5 C23,19.8807119 21.8807119,21 20.5,21 L3.5,21" />
  </Icon>
);

const CircleQuestion = (props) => (
  <Icon {...props} aria-label="CircleQuestion" viewBox="0 0 24 24">
    <path d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,15 L12,14 C12,13 12,12.5 13,12 C14,11.5 15,11 15,9.5 C15,8.5 14,7 12,7 C10,7 9,8.26413718 9,10 M12,16 L12,18" />
  </Icon>
);

const Contact = (props) => (
  <Icon {...props} aria-label="Contact" viewBox="0 0 24 24">
    <path d="M1,2 L22,2 L22,18 L14,18 L6,22 L6,18 L1,18 L1,2 Z M6,10 L7,10 L7,11 L6,11 L6,10 Z M11,10 L12,10 L12,11 L11,11 L11,10 Z M16,10 L17,10 L17,11 L16,11 L16,10 Z" />
  </Icon>
);

const Home = (props) => (
  <Icon {...props} aria-label="Home" viewBox="0 0 24 24">
    <path d="M1,11 L12,2 L23,11 M15,23 L15,15 L15,15 L9,15 L9,23 M4,23 L4,9 M20,23 L20,9" />
  </Icon>
);

const Accessibility = (props) => (
  <Icon {...props} aria-label="Accessibility" viewBox="0 0 24 24">
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4,8 L11,8 L11,14 L7,21 M20,8 L13,8 L13,14 L17,21 M12,5 C12.5522847,5 13,4.55228475 13,4 C13,3.44771525 12.5522847,3 12,3 C11.4477153,3 11,3.44771525 11,4 C11,4.55228475 11.4477153,5 12,5 Z M11,8 L13,8 L13,13 L11,13 L11,8 Z"
    />
  </Icon>
);

export default {
  Configure,
  Inspect,
  Send,
  Deploy,
  Vk,
  Facebook,
  Globe,
  Inf,
  Quora,
  Pinterest,
  Reddit,
  Twitter,
  Whatsapp,
  WeChat,
  Email,
  FacebookMessenger,
  Article,
  CircleQuestion,
  Contact,
  Home,
  Accessibility,
};

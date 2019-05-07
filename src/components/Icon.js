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

function Icon(props) {
  const { children, className, fill, height, label, viewBox, width } = props;
  const dimensions = getIconDimensions(height, width);
  const aria = getIconAriaData(label);

  const style = {
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
      style={props && props.style ? assign({}, style, props.style) : style}
      viewBox={viewBox}
      role={label ? 'img' : null}
      {...aria}
    >
      {children}
    </svg>
  );
}

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

const Configure = props => (
  <Icon {...props} viewBox="0 0 24 24" aria-label="Configure">
    <path d="M16,15 C20.0089021,14.9354541 23,11.9673591 23,8 C23,4.98813056 22.0029673,5.9851632 21,7 C20.0089021,7.97922849 18,10 18,10 L14,6 C14,6 16.0207715,3.99109792 17,3 C18.0148368,1.99703264 18.0148368,1 16,1 C12.0326409,0.999999999 9.05307486,3.99109792 9,8 C9.04154304,8.97626113 9,11 9,11 C7.11486635,12.8970031 4.65923194,15.3526375 3,17 C0.0682492584,19.9436202 4.05637975,23.9317507 7,21 C8.65052042,19.3376102 11.1126942,16.8754364 13,15 C13,15 15.0237389,14.958457 16,15 Z" />
  </Icon>
);

const Inspect = props => (
  <Icon {...props} aria-label="Inspect" viewBox="0 0 24 24">
    <path d="M5.5,21 C7.98528137,21 10,18.9852814 10,16.5 C10,14.0147186 7.98528137,12 5.5,12 C3.01471863,12 1,14.0147186 1,16.5 C1,18.9852814 3.01471863,21 5.5,21 Z M1,16 L1,7 L1,6.5 C1,4.01471863 3.01471863,2 5.5,2 L6,2 M23,16 L23,7 L23,6.5 C23,4.01471863 20.9852814,2 18.5,2 L18,2 M18.5,21 C20.9852814,21 23,18.9852814 23,16.5 C23,14.0147186 20.9852814,12 18.5,12 C16.0147186,12 14,14.0147186 14,16.5 C14,18.9852814 16.0147186,21 18.5,21 Z M10,17 C10,17 10,15 12,15 C14,15 14,17 14,17" />
  </Icon>
);

const Send = props => (
  <Icon {...props} aria-label="Send" viewBox="0 0 24 24">
    <path d="M22,3 L2,11 L20.5,19 L22,3 Z M10,20.5 L13,16 M15.5,9.5 L9,14 L9.85884537,20.0119176 C9.93680292,20.5576204 10.0751625,20.5490248 10.1651297,20.009222 L11,15 L15.5,9.5 Z" />
  </Icon>
);

const Deploy = props => (
  <Icon {...props} aria-label="Deploy" viewBox="0 0 24 24">
    <path d="M23,1 C23,1 16.471872,0.541707069 14,3 C13.9767216,3.03685748 10,7 10,7 L5,8 L2,10 L10,14 L14,22 L16,19 L17,14 C17,14 20.9631426,10.0232786 21,10 C23.4582929,7.5281282 23,1 23,1 Z M17,8 C16.4475,8 16,7.5525 16,7 C16,6.4475 16.4475,6 17,6 C17.5525,6 18,6.4475 18,7 C18,7.5525 17.5525,8 17,8 Z M7,17 C6,16 4,16 3,17 C2,18 2,22 2,22 C2,22 6,22 7,21 C8,20 8,18 7,17 Z" />
  </Icon>
);

const Vk = props => (
  <Icon {...props} aria-label="Vk" viewBox="0 0 2048 1792">
    <path d="M1981 520q23 64-150 294-24 32-65 85-40 51-55 72t-30.5 49.5-12 42 13 34.5 32.5 43 57 53q4 2 5 4 141 131 191 221 3 5 6.5 12.5t7 26.5-.5 34-25 27.5-59 12.5l-256 4q-24 5-56-5t-52-22l-20-12q-30-21-70-64t-68.5-77.5-61-58-56.5-15.5q-3 1-8 3.5t-17 14.5-21.5 29.5-17 52-6.5 77.5q0 15-3.5 27.5t-7.5 18.5l-4 5q-18 19-53 22h-115q-71 4-146-16.5t-131.5-53-103-66-70.5-57.5l-25-24q-10-10-27.5-30t-71.5-91-106-151-122.5-211-130.5-272q-6-16-6-27t3-16l4-6q15-19 57-19l274-2q12 2 23 6.5t16 8.5l5 3q16 11 24 32 20 50 46 103.5t41 81.5l16 29q29 60 56 104t48.5 68.5 41.5 38.5 34 14 27-5q2-1 5-5t12-22 13.5-47 9.5-81 0-125q-2-40-9-73t-14-46l-6-12q-25-34-85-43-13-2 5-24 16-19 38-30 53-26 239-24 82 1 135 13 20 5 33.5 13.5t20.5 24 10.5 32 3.5 45.5-1 55-2.5 70.5-1.5 82.5q0 11-1 42t-.5 48 3.5 40.5 11.5 39 22.5 24.5q8 2 17 4t26-11 38-34.5 52-67 68-107.5q60-104 107-225 4-10 10-17.5t11-10.5l4-3 5-2.5 13-3 20-.5 288-2q39-5 64 2.5t31 16.5z" />
  </Icon>
);

const Facebook = props => (
  <Icon {...props} aria-label="FacebookOption" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      d="M9.94474914,22 L9.94474914,13.1657526 L7,13.1657526 L7,9.48481614 L9.94474914,9.48481614 L9.94474914,6.54006699 C9.94474914,3.49740494 11.8713513,2 14.5856738,2 C15.8857805,2 17.0033128,2.09717672 17.3287076,2.13987558 L17.3287076,5.32020466 L15.4462767,5.32094085 C13.9702212,5.32094085 13.6256856,6.02252733 13.6256856,7.05171716 L13.6256856,9.48481614 L17.306622,9.48481614 L16.5704347,13.1657526 L13.6256856,13.1657526 L13.6845806,22"
    />
  </Icon>
);

const Globe = props => (
  <Icon {...props} aria-label="Globe" viewBox="0 0 24 24">
    <path d="M12,23 C18.0751322,23 23,18.0751322 23,12 C23,5.92486775 18.0751322,1 12,1 C5.92486775,1 1,5.92486775 1,12 C1,18.0751322 5.92486775,23 12,23 Z M12,23 C15,23 16,18 16,12 C16,6 15,1 12,1 C9,1 8,6 8,12 C8,18 9,23 12,23 Z M2,16 L22,16 M2,8 L22,8" />
  </Icon>
);

const Inf = props => (
  <Icon {...props} aria-label="Infinity" viewBox="0 0 24 24">
    <path d="M13 14.5s2 3 5 3 5.5-2.463 5.5-5.5S21 6.5 18 6.5c-5 0-7 11-12 11C2.962 17.5.5 15.037.5 12S3 6.5 6 6.5s4.5 3.5 4.5 3.5" />
  </Icon>
);

const Quora = props => (
  <Icon {...props} aria-label="Quora" viewBox="0 0 448 512">
    <path
      fill="currentColor"
      d="M440.5 386.7h-29.3c-1.5 13.5-10.5 30.8-33 30.8-20.5 0-35.3-14.2-49.5-35.8 44.2-34.2 74.7-87.5 74.7-153C403.5 111.2 306.8 32 205 32 105.3 32 7.3 111.7 7.3 228.7c0 134.1 131.3 221.6 249 189C276 451.3 302 480 351.5 480c81.8 0 90.8-75.3 89-93.3zM297 329.2C277.5 300 253.3 277 205.5 277c-30.5 0-54.3 10-69 22.8l12.2 24.3c6.2-3 13-4 19.8-4 35.5 0 53.7 30.8 69.2 61.3-10 3-20.7 4.2-32.7 4.2-75 0-107.5-53-107.5-156.7C97.5 124.5 130 71 205 71c76.2 0 108.7 53.5 108.7 157.7.1 41.8-5.4 75.6-16.7 100.5z"
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
};

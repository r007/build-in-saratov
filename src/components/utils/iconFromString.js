import React from 'react';
import Icon from '../Icon';

const iconFromString = (iconName, props) => React.createElement(Icon[iconName], { ...props });

export default iconFromString;

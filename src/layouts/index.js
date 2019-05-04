import * as React from 'react';
import Helmet from 'react-helmet';

import './style.css';

// @ts-ignore
import favicon from '../favicon.ico';

const IndexLayout = ({ className, children }) => {
  return (
    <div className={className}>
      <Helmet>
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      {children}
    </div>
  );
};

export default IndexLayout;

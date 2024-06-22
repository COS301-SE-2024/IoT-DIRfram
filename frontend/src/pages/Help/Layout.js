// Layout.js

import React from 'react';
import FloatingIcon from './FloatingIcon'; // Import your FloatingIcon component

const Layout = ({ children }) => {
  return (
    <div>
      <FloatingIcon />
      {children}
    </div>
  );
};

export default Layout;

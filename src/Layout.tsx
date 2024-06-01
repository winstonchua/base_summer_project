// src/Layout.tsx
import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children, isAdmin }) => {
  return (
    <div>
      <Navbar isAdmin={isAdmin} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;

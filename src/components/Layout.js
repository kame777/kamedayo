import React from 'react';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';
import './Layout.css';

const Layout = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`layout ${theme === 'dark' ? 'layout-dark' : ''}`}>
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
import React, { useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import useTheme from '../../hooks/useTheme';

const MainLayout = () => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef(null);
  const { theme, handleThemeChange } = useTheme();

  const toggleThemeMenu = (value) => {
    if (value !== undefined) {
      setShowThemeMenu(value);
    } else {
      setShowThemeMenu(prev => !prev);
    }
  };

  return (
    <div className="app">
      <Navbar 
        theme={theme}
        handleThemeChange={handleThemeChange}
        showThemeMenu={showThemeMenu}
        toggleThemeMenu={toggleThemeMenu}
        themeMenuRef={themeMenuRef}
      />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
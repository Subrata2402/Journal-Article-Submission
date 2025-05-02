import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import useTheme from '../hooks/useTheme';
import { useRef, useState } from 'react';

const MainLayout = ({ children }) => {
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
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
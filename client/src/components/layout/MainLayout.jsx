import React, { useRef, useState, useEffect } from 'react';
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

  // Add click outside handler to close the theme menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        toggleThemeMenu(false);
      }
    };

    // Add event listener when the menu is open
    if (showThemeMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showThemeMenu]);

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
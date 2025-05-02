import { useState, useEffect } from 'react';
import { secureLocalStorage } from '../utils/storageUtil';

/**
 * Custom hook for managing theme preferences (light, dark, or system)
 */
const useTheme = () => {
  // Get initial theme from secureLocalStorage or default to system preference
  const getInitialTheme = () => {
    const savedTheme = secureLocalStorage.getItem('theme');
    return savedTheme || 'system';
  };

  const [theme, setTheme] = useState(getInitialTheme());

  // Apply the current theme to the document
  useEffect(() => {
    const applyTheme = (newTheme) => {
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // If theme is 'system', use the system preference, otherwise use the selected theme
      const effectiveTheme = newTheme === 'system'
        ? (prefersDarkMode ? 'dark' : 'light')
        : newTheme;
      
      document.documentElement.setAttribute('data-theme', effectiveTheme);
    };

    applyTheme(theme);

    // Listen for system preference changes if using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme('system');
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      }
      // Older browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [theme]);

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    secureLocalStorage.setItem('theme', newTheme);
  };

  return {
    theme,
    handleThemeChange
  };
};

export default useTheme;
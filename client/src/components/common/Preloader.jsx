import React, { useEffect } from 'react';
import { hidePreloader } from '../../utils/preloaderUtils';
import '../../assets/styles/common/preloader.scss';

const Preloader = () => {
  useEffect(() => {
    // Hide preloader when React component mounts
    // Allow a small delay for React to fully render
    setTimeout(() => {
      hidePreloader(true);
    }, 500); // Initial delay before starting to hide
  }, []);

  // This component doesn't render anything as it manipulates the DOM element created in index.html
  return null;
};

export default Preloader;

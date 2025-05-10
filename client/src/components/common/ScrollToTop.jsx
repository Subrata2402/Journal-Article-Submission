import React, { useState, useEffect } from 'react';
import { IoArrowUp } from 'react-icons/io5';
import Button from './Button';
import '../../assets/styles/common/scrollToTop.scss';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    
    // Clean up event listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
      <Button 
        className="scroll-to-top__button"
        variant="primary"
        size="sm"
        icon={<IoArrowUp />}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      />
    </div>
  );
};

export default ScrollToTop;

import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyLoad component for lazy loading any content when it comes into view
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to be lazy loaded
 * @param {string} props.height - Height to set before content is loaded
 * @param {string} props.width - Width to set before content is loaded
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.placeholder - Content to show while loading
 * @param {Function} props.onVisible - Callback when content becomes visible
 * @returns {JSX.Element} LazyLoad component
 */
const LazyLoad = ({ 
  children, 
  height = 'auto', 
  width = '100%', 
  className = '',
  placeholder = null,
  onVisible = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element becomes visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          onVisible();
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Load slightly before it comes into view
        threshold: 0.01,     // Trigger when at least 1% is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [onVisible]);

  // Set loaded state after a short delay once visible
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div 
      ref={containerRef}
      className={`lazy-load ${hasLoaded ? 'lazy-load--loaded' : ''} ${className}`}
      style={{ 
        minHeight: !hasLoaded ? height : 'auto', 
        width,
        transition: 'opacity 0.3s ease-in-out',
        opacity: hasLoaded ? 1 : 0.6,
        position: 'relative'
      }}
    >
      {!hasLoaded && placeholder}
      {isVisible && children}
    </div>
  );
};

export default LazyLoad;

/**
 * Utility functions for lazy loading
 */

/**
 * Lazy load an image by providing a src attribute
 * @param {string} src - The source URL of the image to lazy load
 * @param {string} [alt=''] - Alt text for the image
 * @param {Object} [imgProps={}] - Additional props for the image element
 * @returns {JSX.Element} - An image element with lazy loading
 */
export const LazyImage = ({ src, alt = '', ...imgProps }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      loading="lazy" 
      {...imgProps} 
    />
  );
};

/**
 * Create a preload link for a component
 * @param {string} path - The path to the component to preload
 */
export const preloadComponent = (path) => {
  // Create a prefetch link
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'script';
  document.head.appendChild(link);
};

/**
 * Prefetch an image
 * @param {string} src - The source URL of the image to prefetch
 */
export const prefetchImage = (src) => {
  const img = new Image();
  img.src = src;
};

/**
 * Load components ahead of time when hovering over links
 * @param {string} componentPath - The path to the component to preload
 * @returns {Object} - Event handlers for hover effects
 */
export const usePrefetch = (componentPath) => {
  let timer;
  
  return {
    onMouseEnter: () => {
      timer = setTimeout(() => {
        import(/* @vite-ignore */ componentPath);
      }, 100); // Small timeout to prevent unnecessary loads on quick hover
    },
    onMouseLeave: () => {
      if (timer) clearTimeout(timer);
    }
  };
};

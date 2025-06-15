/**
 * Utility functions for controlling the application preloader
 */

/**
 * Manually show the preloader
 * Use this for transitions that require showing the preloader after it's been dismissed
 */
export const showPreloader = () => {
  // Check if preloader exists, if not create it
  let preloader = document.getElementById('preloader');
  
  if (!preloader) {
    // Create a new preloader if it doesn't exist
    preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.className = 'preloader';
      // Create container
    const container = document.createElement('div');
    container.className = 'preloader__container';
    
    // Create logo element
    const logo = document.createElement('img');
    logo.src = '/logo.png';
    logo.alt = 'Journal System Logo';
    logo.className = 'preloader__logo';
    
    // Create progress bar container
    const barContainer = document.createElement('div');
    barContainer.className = 'preloader__bar-container';
    
    // Create progress bar
    const bar = document.createElement('div');
    bar.className = 'preloader__bar';
    barContainer.appendChild(bar);
    
    // Create text element
    const text = document.createElement('p');
    text.className = 'preloader__text';
    text.textContent = 'Loading Journal System';
    
    // Append all elements to the container
    container.appendChild(logo);
    container.appendChild(barContainer);
    container.appendChild(text);
    
    // Append container to preloader
    preloader.appendChild(container);
    
    // Add to DOM
    document.body.appendChild(preloader);
  }
  
  // Remove hidden class if present
  preloader.classList.remove('preloader--hidden');
  
  // Return the preloader reference for chaining
  return preloader;
};

/**
 * Manually hide the preloader
 * @param {boolean} removeFromDOM - Whether to completely remove the element from DOM after transition
 */
export const hidePreloader = (removeFromDOM = true) => {
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    // Add hidden class
    preloader.classList.add('preloader--hidden');
    
    if (removeFromDOM) {
      // Remove from DOM after transition completes
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 500); // Match this to the CSS transition duration
    }
  }
};

export default {
  show: showPreloader,
  hide: hidePreloader
};

import React, { useState } from 'react';
import LazyLoad from './LazyLoad';
import Spinner from './Spinner';

/**
 * LazyImage component for lazy loading images
 * @param {Object} props - Component props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.height - Height to set before image loads
 * @param {string} props.width - Width to set before image loads
 * @param {string} props.className - Additional CSS classes for the image
 * @param {Object} props.imgStyle - Additional style for the image
 * @param {string} props.objectFit - Object-fit property for the image
 * @param {boolean} props.showPlaceholder - Whether to show a placeholder while loading
 * @returns {JSX.Element} LazyImage component
 */
const LazyImage = ({ 
  src, 
  alt = '', 
  height = '200px', 
  width = '100%',
  className = '', 
  imgStyle = {}, 
  objectFit = 'cover',
  showPlaceholder = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <LazyLoad
      height={height}
      width={width}
      className={`lazy-image-container ${className}`}
      placeholder={showPlaceholder ? <div className="lazy-image-placeholder">
        <Spinner size="small" />
      </div> : null}
    >      {!imageError ? (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${imageLoaded ? 'lazy-image--loaded' : ''}`}
          style={{
            objectFit,
            width: '100%',
            height: '100%',
            transition: 'opacity 0.3s ease-in-out',
            opacity: imageLoaded ? 1 : 0,
            ...imgStyle
          }}
          crossOrigin="anonymous"
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="lazy-image-error">
          <span>Image not available</span>
        </div>
      )}
    </LazyLoad>
  );
};

export default LazyImage;

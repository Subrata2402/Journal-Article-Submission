import React from 'react';
import { Link } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import '../assets/styles/pages/notFound.scss';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-header">
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>
            The page you are looking for doesn't exist or has been moved.
            Please check the URL for mistakes and try again.
          </p>
        </div>
        
        <div className="not-found-actions">
          <Link to="/" className="back-to-home">
            <IoArrowBackOutline /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

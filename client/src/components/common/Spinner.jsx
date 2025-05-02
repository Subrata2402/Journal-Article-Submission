import React from 'react';
import '../../assets/styles/common/spinner.scss';

const Spinner = ({ size = 'medium', color = 'primary', fullPage = false }) => {
  const spinnerClasses = `spinner spinner--${size} spinner--${color} ${fullPage ? 'spinner--fullpage' : ''}`;
  
  return (
    <div className={spinnerClasses}>
      <div className="spinner__circle"></div>
      {fullPage && <p className="spinner__text">Loading...</p>}
    </div>
  );
};

export default Spinner;
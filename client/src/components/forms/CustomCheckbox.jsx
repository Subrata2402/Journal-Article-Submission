import React, { useRef } from 'react';
import { IoCheckmark } from 'react-icons/io5';
import '../../assets/styles/common/forms.scss';

/**
 * A custom styled checkbox component
 * 
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {Function} onChange - Callback when the checkbox state changes
 * @param {string} [label] - Optional label for the checkbox
 * @param {string} [id] - Optional id for the checkbox
 * @param {string} [name] - Optional name for the checkbox
 * @param {boolean} [disabled=false] - Whether the checkbox is disabled
 * @param {string} [className=''] - Additional CSS class names
 * @param {string} [size='medium'] - Size of the checkbox ('small', 'medium', 'large')
 * @param {string} [color] - Custom color for the checkbox when checked
 */
const CustomCheckbox = ({ 
  checked, 
  onChange, 
  label, 
  id, 
  name,
  disabled = false, 
  className = '',
  size = 'medium',
  color
}) => {
  const inputRef = useRef(null);
  
  const handleChange = (e) => {
    // Pass the checked state to the parent component
    onChange(e.target.checked);
  };
  
  const handleClick = (e) => {
    // For certain cases, we may want to prevent propagation when inside other clickable elements
    e.stopPropagation();
  };
  
  // Generate classes based on props
  const checkboxClasses = [
    'custom-checkbox',
    `custom-checkbox--${size}`,
    checked ? 'custom-checkbox--checked' : '',
    disabled ? 'custom-checkbox--disabled' : '',
    className
  ].filter(Boolean).join(' ');
  
  const checkboxStyle = color && checked ? { 
    '--checkbox-checked-color': color,
    '--checkbox-checked-border': color 
  } : {};

  return (
    <div className={checkboxClasses} style={checkboxStyle}>
      <input
        ref={inputRef}
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleChange}
        onClick={handleClick}
        disabled={disabled}
        className="custom-checkbox__input"
      />
      <div className="custom-checkbox__control">
        {checked && (
          <IoCheckmark className="custom-checkbox__icon" />
        )}
      </div>
      {label && (
        <label 
          htmlFor={id} 
          className="custom-checkbox__label"
          onClick={(e) => {
            if (disabled) e.preventDefault();
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default CustomCheckbox;
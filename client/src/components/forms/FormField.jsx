import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import '../../assets/styles/common/forms.scss';

const FormField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  autoComplete,
  maxLength,
  icon, // Added icon prop
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const fieldClasses = [
    'form-field',
    error ? 'form-field--error' : '',
    className
  ].filter(Boolean).join(' ');
  
  const id = `field-${name}`;
  
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  // Determine the input type for password fields
  const inputType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {icon && <span className="form-field__icon">{icon}</span>}
          <span className="form-field__label-text">
            {label}
            {required && <span className="form-field__required">*</span>}
          </span>
        </label>
      )}
      
      <div className="form-field__input-wrapper">
        <input
          id={id}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className="form-field__input"
          autoComplete={autoComplete}
          maxLength={maxLength}
          {...props}
        />
        
        {type === 'password' && (
          <button 
            type="button"
            className="form-field__password-toggle"
            onClick={togglePasswordVisibility}
            tabIndex="-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
      
      {maxLength && value && (
        <div className="form-field__character-count">
          {value.length}/{maxLength}
        </div>
      )}
      
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
};

export default FormField;
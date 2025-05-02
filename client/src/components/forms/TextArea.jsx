import React from 'react';
import '../../assets/styles/common/forms.scss';

const TextArea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
  maxLength,
  autoResize = false,
  ...props
}) => {
  const fieldClasses = [
    'form-field',
    'textarea-field',
    error ? 'form-field--error' : '',
    className
  ].filter(Boolean).join(' ');
  
  const id = `textarea-${name}`;
  
  // Handle auto-resize functionality
  const handleResize = (e) => {
    if (autoResize) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };
  
  const handleChange = (e) => {
    if (autoResize) {
      handleResize(e);
    }
    onChange(e);
  };
  
  return (
    <div className={fieldClasses}>
      {label && (
        <label htmlFor={id} className="form-field__label">
          {label}
          {required && <span className="form-field__required">*</span>}
        </label>
      )}
      
      <textarea
        id={id}
        name={name}
        value={value || ''}
        onChange={handleChange}
        onInput={autoResize ? handleResize : undefined}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className="form-field__textarea"
        rows={rows}
        maxLength={maxLength}
        {...props}
      />
      
      {maxLength && value && (
        <div className="form-field__character-count">
          {value.length}/{maxLength}
        </div>
      )}
      
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
};

export default TextArea;
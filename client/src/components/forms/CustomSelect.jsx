import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';
import '../../assets/styles/common/forms.scss';

const CustomSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select an option", 
  name,
  error,
  label,
  required,
  loading,
  loadingComponent,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const selectRef = useRef(null);
  
  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option, e) => {
    // Stop the event from bubbling up to parent elements
    if (e) {
      e.stopPropagation();
    }
    
    onChange({ target: { name, value: option.value } });
    setIsOpen(false);
    setHighlightedIndex(options.findIndex(opt => opt.value === option.value));
  };

  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(prev => !prev);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (loading) return;
    
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && options.length > 0) {
        handleOptionClick(options[highlightedIndex]);
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
      } else {
        setIsOpen(true);
        setHighlightedIndex(options.length - 1);
      }
    }
  };

  return (
    <div className="form-field custom-select-container">
      {label && (
        <label className="form-field__label">
          {icon && <span className="form-field__icon">{icon}</span>}
          <span className="form-field__label-text">
            {label}
            {required && <span className="form-field__required">*</span>}
          </span>
        </label>
      )}
      
      <div 
        ref={selectRef}
        className={`custom-select ${isOpen ? 'open' : ''} ${error ? 'error' : ''}`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        role="combobox"
      >
        {loading ? (
          loadingComponent || <div className="custom-select-loading">Loading...</div>
        ) : (
          <>
            <div className="custom-select-value">
              {selectedOption ? selectedOption.label : placeholder}
            </div>
            
            <div className="custom-select-icon">
              {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </div>
            
            {isOpen && options.length > 0 && (
              <ul 
                className="custom-select-dropdown"
                role="listbox" 
              >
                {options.map((option, index) => (
                  <li
                    key={option.value}
                    className={`custom-select-option ${option.value === value ? 'selected' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
                    onClick={(e) => handleOptionClick(option, e)}
                    aria-selected={option.value === value}
                    role="option"
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
};

export default CustomSelect;
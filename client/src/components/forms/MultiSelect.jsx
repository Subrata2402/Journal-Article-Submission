import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDownOutline, IoChevronUpOutline, IoSearchOutline, IoClose } from 'react-icons/io5';
import CustomCheckbox from './CustomCheckbox';
import '../../assets/styles/common/forms.scss';

/**
 * A multi-select dropdown component with search functionality
 * 
 * @param {Object[]} options - The options for the select dropdown
 * @param {string} options[].value - The value of the option
 * @param {string} options[].label - The label to display for the option
 * @param {string[]} values - Array of selected values
 * @param {Function} onChange - Callback when the selection changes
 * @param {string} [placeholder="Select options"] - Placeholder text when no option is selected
 * @param {string} [name] - The name of the select field
 * @param {string} [error] - Error message to display
 * @param {string} [label] - Label text for the field
 * @param {boolean} [required=false] - Whether the field is required
 * @param {boolean} [loading=false] - Whether the options are loading
 * @param {React.ReactNode} [loadingComponent] - Custom component to display while loading
 * @param {React.ReactNode} [icon] - Icon to display with the label
 * @param {boolean} [searchable=true] - Enable search functionality
 * @param {string} [searchPlaceholder="Search options..."] - Placeholder for the search input
 * @param {number} [searchThreshold=5] - Minimum number of options to show search functionality
 */
const MultiSelect = ({ 
  options, 
  values = [], 
  onChange, 
  placeholder = "Select options", 
  name,
  error,
  label,
  required,
  loading,
  loadingComponent,
  icon,
  searchable = true,
  searchPlaceholder = "Search options...",
  searchThreshold = 5
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Filter options based on search query
  const filteredOptions = searchQuery.trim() === '' ? options : options.filter(option => 
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Reset search query and highlighted index when dropdown closes
    if (!isOpen) {
      setSearchQuery('');
      setHighlightedIndex(0);
    }
  }, [isOpen, searchable]);
  
  // Keep highlighted option in view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0) {
      const dropdownEl = document.querySelector('.custom-select-dropdown');
      const highlightedEl = document.querySelector('.custom-select-option.highlighted');
      
      if (dropdownEl && highlightedEl) {
        const dropdownRect = dropdownEl.getBoundingClientRect();
        const highlightedRect = highlightedEl.getBoundingClientRect();
        
        const isAbove = highlightedRect.top < dropdownRect.top;
        const isBelow = highlightedRect.bottom > dropdownRect.bottom;
        
        if (isAbove || isBelow) {
          highlightedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
  }, [highlightedIndex, isOpen]);
  
  const handleOptionClick = (option, e) => {
    // Stop the event from bubbling up to parent elements
    if (e) {
      e.stopPropagation();
    }
    
    // Toggle selected state for the option
    const newValues = values.includes(option.value)
      ? values.filter(v => v !== option.value)
      : [...values, option.value];
    
    onChange({ target: { name, value: newValues } });
    
    // Don't close the dropdown - let users select multiple options
    setHighlightedIndex(options.findIndex(opt => opt.value === option.value));
  };

  const toggleDropdown = () => {
    if (!loading) {
      setIsOpen(prev => !prev);
    }
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Reset highlighted index to first item when search changes
    setHighlightedIndex(0);
  };
  
  const handleSearchClick = (e) => {
    // Prevent dropdown from closing when clicking in the search input
    e.stopPropagation();
  };
  
  // Remove a selected value
  const removeValue = (value, e) => {
    e.stopPropagation(); // Prevent the dropdown from toggling
    const newValues = values.filter(v => v !== value);
    onChange({ target: { name, value: newValues } });
  };
  
  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (loading) return;
    
    // If search input is focused and dropdown is open, don't handle space or other typing keys
    if (isOpen && 
        document.activeElement === searchInputRef.current && 
        e.key !== "Enter" && 
        e.key !== "Escape" && 
        e.key !== "ArrowDown" && 
        e.key !== "ArrowUp") {
      return;
    }
    
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        handleOptionClick(filteredOptions[highlightedIndex]);
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      } else {
        setIsOpen(true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (isOpen) {
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      } else {
        setIsOpen(true);
        setHighlightedIndex(filteredOptions.length - 1);
      }
    }
  };
  
  // Handle key events in search input
  const handleSearchInputKeyDown = (e) => {
    // Allow typing in the search field
    e.stopPropagation();
    
    // But still handle navigation keys
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filteredOptions.length > 0) {
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
      }
    } else if (e.key === "Enter" && filteredOptions.length > 0) {
      e.preventDefault();
      handleOptionClick(filteredOptions[highlightedIndex]);
    } else if (e.key === "Tab") {
      // Let Tab work normally but close dropdown when tabbing out
      if (!e.shiftKey) {
        setTimeout(() => {
          if (!selectRef.current?.contains(document.activeElement)) {
            setIsOpen(false);
          }
        }, 0);
      }
    }
  };
  
  // Get selected option labels for display
  const selectedOptionLabels = options
    .filter(option => values.includes(option.value))
    .map(option => option.label);
  
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
            <div className="custom-select-value multi-select-values">
              {values.length > 0 ? (
                <div className="selected-tags">
                  {selectedOptionLabels.map((label, index) => (
                    <span className="selected-tag" key={index}>
                      {label}
                      <button 
                        className="remove-tag-btn"
                        onClick={(e) => removeValue(options.find(opt => opt.label === label)?.value, e)}
                        aria-label={`Remove ${label}`}
                      >
                        <IoClose />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                placeholder
              )}
            </div>
            
            <div className="custom-select-icon">
              {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </div>
            
            {isOpen && (
              <div className="custom-select-dropdown-container">
                {/* Search box */}
                {searchable && options.length >= searchThreshold && (
                  <div className="custom-select-search">
                    <div className="search-icon">
                      <IoSearchOutline />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onClick={handleSearchClick}
                      onKeyDown={handleSearchInputKeyDown}
                      className="search-input"
                      aria-label="Search options"
                    />
                  </div>
                )}
                
                {/* Options list */}
                <ul 
                  className="custom-select-dropdown"
                  role="listbox" 
                  aria-multiselectable="true"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option, index) => (                      <li
                        key={option.value}
                        className={`custom-select-option multi-select-option ${values.includes(option.value) ? 'selected' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
                        onClick={(e) => handleOptionClick(option, e)}
                        aria-selected={values.includes(option.value)}
                        role="option"
                      >
                        <CustomCheckbox 
                          checked={values.includes(option.value)}
                          size="small"
                          onChange={(_) => {
                            // We need to handle the onChange separately to prevent event propagation issues
                            handleOptionClick(option, { stopPropagation: () => {} });
                          }}
                        />
                        <span className="option-label">{option.label}</span>
                      </li>
                    ))
                  ) : (
                    <li className="custom-select-no-options">No options found</li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
      
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
};

export default MultiSelect;

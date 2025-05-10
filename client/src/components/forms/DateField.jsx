import React, { useState, useRef, useEffect } from 'react';
import { IoCalendarOutline, IoChevronBackOutline, IoChevronForwardOutline, IoChevronDownOutline } from 'react-icons/io5';

const DateField = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
  placeholder = 'Select a date',
  minDate,
  maxDate,
  icon, // Added icon prop
}) => {  const [showPicker, setShowPicker] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const pickerRef = useRef(null);
  const dateFieldRef = useRef(null);
  
  // Format the date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Get month and year display
  const getMonthYearDisplay = () => {
    return viewDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Generate days for the month
  const getDaysInMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Previous month's days
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: month - 1,
        year,
        isCurrentMonth: false
      });
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Add next month's days to complete the calendar (42 cells for 6 weeks)
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        month: month + 1,
        year,
        isCurrentMonth: false
      });
    }
    
    return days;
  };
  
  // Get list of months
  const getMonths = () => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  };
  
  // Get list of years (20 years before and after current year)
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    
    for (let i = currentYear - 100; i <= currentYear; i++) {
      years.push(i);
    }
    
    return years;
  };
  
  // Handle month selection
  const handleMonthSelect = (monthIndex) => {
    setViewDate(new Date(viewDate.getFullYear(), monthIndex, 1));
    setShowMonthSelector(false);
  };
  
  // Handle year selection
  const handleYearSelect = (year) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
    setShowYearSelector(false);
  };
  
  // Check if a date is selected
  const isDateSelected = (day, month, year) => {
    if (!value) return false;
    
    const selectedDate = new Date(value);
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };
  
  // Check if a date is today
  const isToday = (day, month, year) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };
  
  // Check if a date is disabled
  const isDateDisabled = (day, month, year) => {
    const date = new Date(year, month, day);
    
    if (minDate) {
      const min = new Date(minDate);
      if (date < min) return true;
    }
    
    if (maxDate) {
      const max = new Date(maxDate);
      if (date > max) return true;
    }
    
    return false;
  };
    // Handle day selection
  const handleSelectDate = (day, month, year) => {
    if (isDateDisabled(day, month, year)) return;
    
    // Fix timezone issues by using UTC methods to ensure correct date
    const selectedDate = new Date(Date.UTC(year, month, day));
    const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    onChange({ target: { name, value: formattedDate } });
    setShowPicker(false);
  };
  
  // Navigate to previous month
  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  
  // Toggle month selector
  const toggleMonthSelector = (e) => {
    e.stopPropagation();
    setShowYearSelector(false);
    setShowMonthSelector(!showMonthSelector);
  };
  
  // Toggle year selector
  const toggleYearSelector = (e) => {
    e.stopPropagation();
    setShowMonthSelector(false);
    setShowYearSelector(!showYearSelector);
  };
    // Handle click outside to close the picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
        setShowMonthSelector(false);
        setShowYearSelector(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Check if date picker should be shown above or below
  const checkPosition = () => {
    if (dateFieldRef.current) {
      const rect = dateFieldRef.current.getBoundingClientRect();
      const bottomSpace = window.innerHeight - rect.bottom;
      // If less than 350px of space below, show above (date picker is about 300-350px tall)
      const shouldShowAbove = bottomSpace < 350;
      setShowAbove(shouldShowAbove);
    }
  };
  
  // Toggle the date picker and check position
  const toggleDatePicker = () => {
    if (!showPicker) {
      checkPosition();
    }
    setShowPicker(!showPicker);
  };

  // Generate weekday headers
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="form-field">
      <label htmlFor={name} className={required ? 'form-field__label' : 'form-field__label'}>
        {icon && <span className="form-field__icon">{icon}</span>}
        <span className="form-field__label-text">
          {label}
          {required && <span className="form-field__required">*</span>}
        </span>
      </label>
        <div className="custom-date-field" ref={dateFieldRef}>
        <div 
          className={`date-display ${error ? 'error' : ''}`} 
          onClick={toggleDatePicker}
        >
          {value ? (
            <span className="selected-date">
              {formatDateForDisplay(value)}
            </span>
          ) : (
            <span className="date-placeholder">{placeholder}</span>
          )}
          <IoCalendarOutline className="calendar-icon" />
        </div>
        
        {showPicker && (
          <div ref={pickerRef} className={`custom-date-picker ${showAbove ? 'position-above' : ''}`}>
            <div className="date-picker-header">
              <button 
                type="button" 
                className="month-nav-btn" 
                onClick={goToPrevMonth}
              >
                <IoChevronBackOutline />
              </button>
              
              <div className="month-year-selectors">
                <button 
                  type="button" 
                  className="month-selector" 
                  onClick={toggleMonthSelector}
                >
                  {viewDate.toLocaleDateString('en-US', { month: 'long' })}
                  <IoChevronDownOutline />
                </button>
                <button 
                  type="button" 
                  className="year-selector" 
                  onClick={toggleYearSelector}
                >
                  {viewDate.getFullYear()}
                  <IoChevronDownOutline />
                </button>
              </div>
              
              <button 
                type="button" 
                className="month-nav-btn" 
                onClick={goToNextMonth}
              >
                <IoChevronForwardOutline />
              </button>
            </div>
            
            {showMonthSelector && (
              <div className="month-selector-dropdown">
                {getMonths().map((month, index) => (
                  <button
                    key={month}
                    type="button"
                    className={`month-option ${index === viewDate.getMonth() ? 'active' : ''}`}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            )}
            
            {showYearSelector && (
              <div className="year-selector-dropdown">
                {getYears().map((year) => (
                  <button
                    key={year}
                    type="button"
                    className={`year-option ${year === viewDate.getFullYear() ? 'active' : ''}`}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
            
            {!showMonthSelector && !showYearSelector && (
              <>
                <div className="weekday-header">
                  {weekdays.map(day => (
                    <div key={day} className="weekday">{day}</div>
                  ))}
                </div>
                
                <div className="days-grid">
                  {getDaysInMonth().map((date, index) => (
                    <div 
                      key={index} 
                      className={`day-cell ${!date.isCurrentMonth ? 'other-month' : ''} 
                                  ${isDateSelected(date.day, date.month, date.year) ? 'selected' : ''} 
                                  ${isToday(date.day, date.month, date.year) ? 'today' : ''} 
                                  ${isDateDisabled(date.day, date.month, date.year) ? 'disabled' : ''}`} 
                      onClick={() => handleSelectDate(date.day, date.month, date.year)}
                    >
                      {date.day}
                    </div>
                  ))}
                </div>
                
                <div className="date-picker-footer">
                  <button 
                    type="button" 
                    className="today-btn"
                    onClick={() => {
                      const today = new Date();
                      if (!isDateDisabled(today.getDate(), today.getMonth(), today.getFullYear())) {
                        handleSelectDate(today.getDate(), today.getMonth(), today.getFullYear());
                      }
                    }}
                  >
                    Today
                  </button>
                  <button 
                    type="button" 
                    className="clear-btn"
                    onClick={() => {
                      onChange({ target: { name, value: '' } });
                      setShowPicker(false);
                    }}
                  >
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Hidden input for form submission */}
        <input 
          type="hidden"
          id={name}
          name={name}
          value={value || ''}
          autoComplete={autoComplete}
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DateField;
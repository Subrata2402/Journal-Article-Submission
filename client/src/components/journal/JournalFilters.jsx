import React, { useState, useRef, useEffect } from 'react';
import { IoSearch, IoClose, IoOptions, IoChevronBack } from 'react-icons/io5';
import DateField from '../forms/DateField';
import '../../assets/styles/journal/journalFilters.scss';

const JournalFilters = ({ 
  onFilterChange, 
  onSearchChange, 
  categories = [], 
  tags = [],
  loading = false 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const filtersSidebarRef = useRef(null);
  const filterButtonRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      applyFilters(newCategories, selectedTags, dateRange);
      return newCategories;
    });
  };

  const handleTagChange = (tag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];
      
      applyFilters(selectedCategories, newTags, dateRange);
      return newTags;
    });
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => {
      const newDateRange = { ...prev, [field]: value };
      applyFilters(selectedCategories, selectedTags, newDateRange);
      return newDateRange;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setDateRange({ from: '', to: '' });
    applyFilters([], [], { from: '', to: '' });
  };

  const applyFilters = (categories, tags, dates) => {
    onFilterChange({
      categories,
      tags,
      dateRange: dates
    });
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
    // Add overflow hidden to body when sidebar is open to prevent scrolling
    document.body.style.overflow = !showFilters ? 'hidden' : '';
  };

  // Handle click outside to close the filters sidebar (for all screen sizes)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersSidebarRef.current && 
          !filtersSidebarRef.current.contains(event.target) &&
          filterButtonRef.current &&
          !filterButtonRef.current.contains(event.target)) {
        setShowFilters(false);
        document.body.style.overflow = '';
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Reset overflow when component unmounts
      document.body.style.overflow = '';
    };
  }, []);

  // Calculate active filters count
  const activeFiltersCount = 
    selectedCategories.length + 
    selectedTags.length + 
    (dateRange.from ? 1 : 0) + 
    (dateRange.to ? 1 : 0);

  return (
    <div className="journal-filters">
      {/* Fixed Filter Button */}
      <button 
        ref={filterButtonRef}
        className={`filter-button-fixed ${showFilters ? 'active' : ''} ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
        onClick={toggleFilters}
        aria-label="Toggle filters"
        aria-expanded={showFilters}
      >
        {showFilters ? <IoChevronBack className="filter-icon" /> : <IoOptions className="filter-icon" />}
        {activeFiltersCount > 0 && (
          <span className="filter-badge">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Centered Search Box */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search journals..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => {
                setSearchTerm('');
                onSearchChange('');
              }}
              aria-label="Clear search"
            >
              <IoClose />
            </button>
          )}
        </div>
      </div>
      
      {/* Sidebar Filter Panel */}
      <div className={`filters-sidebar ${showFilters ? 'open' : ''}`} ref={filtersSidebarRef}>
        <div className="filters-sidebar-header">
          <h3>Filter Journals</h3>
        </div>
        
        <div className="filters-sidebar-content">
          <div className="filter-section">
            <h4>Categories</h4>
            {loading ? (
              <p className="loading-text">Loading categories...</p>
            ) : (
              <div className="filter-options">
                {categories.length === 0 ? (
                  <p>No categories available</p>
                ) : (
                  categories.map((category) => (
                    <label key={category} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className="checkbox-label">{category}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          
          <div className="filter-section">
            <h4>Tags</h4>
            {loading ? (
              <p className="loading-text">Loading tags...</p>
            ) : (
              <div className="filter-options">
                {tags.length === 0 ? (
                  <p>No tags available</p>
                ) : (
                  tags.map((tag) => (
                    <label key={tag} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                      <span className="checkbox-label">{tag}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
          
          <div className="filter-section date-filter-section">
            <h4>Published Date</h4>
            <div className="date-filters">
              <DateField
                label="From"
                name="from-date"
                value={dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
                placeholder="From date"
                maxDate={dateRange.to || undefined}
              />
              
              <DateField
                label="To"
                name="to-date"
                value={dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
                placeholder="To date"
                minDate={dateRange.from || undefined}
              />
            </div>
          </div>
        </div>

        <div className="filters-sidebar-footer">
          <button 
            className="reset-filters-button" 
            onClick={clearFilters}
            disabled={!(selectedCategories.length || selectedTags.length || dateRange.from || dateRange.to)}
          >
            Reset Filters
          </button>
        </div>
        
        {/* Close button (mobile only) */}
        <button className="close-filters-button" onClick={toggleFilters} aria-label="Close filters">
          <IoChevronBack />
        </button>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {showFilters && <div className="sidebar-overlay" onClick={toggleFilters}></div>}
    </div>
  );
};

export default JournalFilters;
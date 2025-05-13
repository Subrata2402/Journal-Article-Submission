import { useState, useRef, useEffect } from 'react';
import {
  IoSearch,
  IoClose,
  IoChevronBack,
  IoCalendarOutline,
  IoFilterOutline,
  IoFunnelOutline
} from 'react-icons/io5';
import DateField from '../forms/DateField';
import CustomSelect from '../forms/CustomSelect';
import '../../assets/styles/article/articleFilters.scss';

const ArticleFilters = ({
  onFilterChange,
  onSearchChange,
  loading = false
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const filtersSidebarRef = useRef(null);
  const filterButtonRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    applyFilters(status, dateRange);
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => {
      const newDateRange = { ...prev, [field]: value };
      applyFilters(selectedStatus, newDateRange);
      return newDateRange;
    });
  };

  const clearFilters = () => {
    setSelectedStatus('');
    setDateRange({ from: '', to: '' });
    applyFilters('', { from: '', to: '' });
  };

  const applyFilters = (status, dates) => {
    onFilterChange({
      status,
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
    (selectedStatus ? 1 : 0) +
    (dateRange.from ? 1 : 0) +
    (dateRange.to ? 1 : 0);

  return (
    <div className="article-filters">
      {/* Fixed Filter Button */}
      <button
        ref={filterButtonRef}
        className={`filter-button-fixed ${showFilters ? 'active' : ''} ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
        onClick={toggleFilters}
        aria-label="Toggle filters"
        aria-expanded={showFilters}
      >
        {showFilters ? <IoChevronBack className="filter-icon" /> : <IoFunnelOutline className="filter-icon" />}
        {activeFiltersCount > 0 && (
          <span className="filter-badge">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Search & Filter Container */}
      <div className="search-filter-container">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <IoSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => {
                setSearchTerm('');
                onSearchChange('');
              }}
            >
              <IoClose />
            </button>
          )}
        </div>

        {/* Filter Button (visible on medium and larger screens) */}
        <button
          className={`filter-button ${showFilters ? 'active' : ''} ${activeFiltersCount > 0 ? 'has-filters' : ''}`}
          onClick={toggleFilters}
        >
          <IoFilterOutline className="filter-icon" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
        </button>
      </div>

      {/* Filters Sidebar */}
      <div
        ref={filtersSidebarRef}
        className={`filters-sidebar ${showFilters ? 'active' : ''}`}
      >
        <div className="filters-sidebar-header">
          <h3>Filter Articles</h3>
          <button
            className="close-button"
            onClick={toggleFilters}
            aria-label="Close filters"
          >
            <IoClose />
          </button>
        </div>

        <div className="filters-sidebar-content">
          <div className="filter-section">
            <div className="section-header">
              <IoFilterOutline className="section-icon" />
              <h4>Status</h4>
            </div>
            <div className="filter-options">
              <CustomSelect
                placeholder="Select status"
                name="status"
                value={selectedStatus}
                onChange={handleStatusChange}
                options={[
                  { value: '', label: 'All Statuses' },
                  { value: 'submitted', label: 'Submitted' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'under review', label: 'Under Review' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'rejected', label: 'Rejected' }
                ]}
              />
            </div>
          </div>

          <div className="filter-section date-filter-section">
            <div className="section-header">
              <IoCalendarOutline className="section-icon" />
              <h4>Submission Date</h4>
            </div>
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
            disabled={!selectedStatus && !dateRange.from && !dateRange.to}
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

export default ArticleFilters;

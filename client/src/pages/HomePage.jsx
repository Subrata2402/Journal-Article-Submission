import React, { useState, useEffect } from 'react';
import JournalList from '../components/journal/JournalList';
import JournalFilters from '../components/journal/JournalFilters';
import Spinner from '../components/common/Spinner';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import journalService from '../services/journalService';
import { formatDate } from '../utils/formatters';
import '../assets/styles/pages/home.scss';

const HomePage = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    tags: [],
    dateRange: { from: '', to: '' }
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [pinnedJournalIds, setPinnedJournalIds] = useState([]);
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    fetchJournals();
    fetchMetadata();
    loadPinnedJournals();
  }, []);

  // Apply filters and search when journals, searchTerm, activeFilters, or showPinnedOnly change
  useEffect(() => {
    if (journals.length > 0) {
      applyFiltersAndSearch();
    }
  }, [journals, searchTerm, activeFilters, showPinnedOnly, pinnedJournalIds]);

  const fetchJournals = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const result = await journalService.getJournalList(page, limit);
      if (result.success) {
        setJournals(result.data.journals);
        setFilteredJournals(result.data.journals);
        setPagination(result.data.pagination);
      } else {
        setError('Failed to fetch journals');
      }
    } catch (err) {
      console.error('Error fetching journals:', err);
      setError('An error occurred while fetching journals. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    setMetadataLoading(true);
    try {
      // Fetch categories and tags in parallel
      const [categoriesResult, tagsResult] = await Promise.all([
        journalService.getCategories(),
        journalService.getTags()
      ]);
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
      
      if (tagsResult.success) {
        setTags(tagsResult.data);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    } finally {
      setMetadataLoading(false);
    }
  };
  
  const loadPinnedJournals = () => {
    const pinnedIds = journalService.getPinnedJournals();
    setPinnedJournalIds(pinnedIds);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };
  
  const togglePinnedFilter = () => {
    setShowPinnedOnly(prev => !prev);
  };
  
  const handlePinStatusChange = () => {
    // Reload pinned journal IDs from localStorage
    loadPinnedJournals();
  };

  const applyFiltersAndSearch = () => {
    let results = [...journals];
    
    // Apply pinned filter first if enabled
    if (showPinnedOnly) {
      results = results.filter(journal => pinnedJournalIds.includes(journal._id));
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(journal => 
        journal.title?.toLowerCase().includes(term) || 
        journal.description?.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (activeFilters.categories.length > 0) {
      results = results.filter(journal => 
        journal.category && activeFilters.categories.includes(journal.category)
      );
    }
    
    // Apply tag filter
    if (activeFilters.tags.length > 0) {
      results = results.filter(journal => 
        journal.tags && journal.tags.some(tag => activeFilters.tags.includes(tag))
      );
    }
    
    // Apply date range filter
    if (activeFilters.dateRange.from || activeFilters.dateRange.to) {
      results = results.filter(journal => {
        const publishDate = new Date(journal.publishedDate || journal.createdAt);
        
        if (activeFilters.dateRange.from && activeFilters.dateRange.to) {
          const fromDate = new Date(activeFilters.dateRange.from);
          const toDate = new Date(activeFilters.dateRange.to);
          // Make toDate inclusive of the whole day
          toDate.setHours(23, 59, 59, 999);
          return publishDate >= fromDate && publishDate <= toDate;
        }
        
        if (activeFilters.dateRange.from) {
          const fromDate = new Date(activeFilters.dateRange.from);
          return publishDate >= fromDate;
        }
        
        if (activeFilters.dateRange.to) {
          const toDate = new Date(activeFilters.dateRange.to);
          // Make toDate inclusive of the whole day
          toDate.setHours(23, 59, 59, 999);
          return publishDate <= toDate;
        }
        
        return true;
      });
    }
    
    setFilteredJournals(results);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchJournals(newPage, pagination.limit);
  };

  if (authLoading) {
    return <Spinner fullPage />;
  }

  return (
    <>
      <header className="page-header">
        <h1>Available Journals</h1>
        <p>Access peer-reviewed journals across various disciplines. Browse our collection of scientific journals and submit your articles</p>
      </header>
      
      <div className="filter-controls">
        <JournalFilters
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          categories={categories}
          tags={tags}
          loading={metadataLoading}
        />
        
        <button 
          className={`pinned-filter-button ${showPinnedOnly ? 'active' : ''}`}
          onClick={togglePinnedFilter}
          title={showPinnedOnly ? 'Show all journals' : 'Show pinned journals only'}
        >
          {showPinnedOnly ? <IoBookmark /> : <IoBookmarkOutline />}
          <span>{showPinnedOnly ? 'Pinned Only' : 'All Journals'}</span>
        </button>
      </div>
      
      <JournalList 
        journals={filteredJournals}
        loading={loading}
        error={error}
        pagination={pagination}
        formatDate={formatDate}
        fetchJournals={fetchJournals}
        handlePageChange={handlePageChange}
        onPinStatusChange={handlePinStatusChange}
        showPinnedOnly={showPinnedOnly}
      />
    </>
  );
};

export default HomePage;
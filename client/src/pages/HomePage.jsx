import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import JournalList from '../components/journal/JournalList';
import JournalFilters from '../components/journal/JournalFilters';
import Spinner from '../components/common/Spinner';
import useTheme from '../hooks/useTheme';
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
  
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef(null);
  
  const { theme, handleThemeChange } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    fetchJournals();
    fetchMetadata();

    // Close theme menu when clicking outside
    const handleClickOutside = (event) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply filters and search when journals, searchTerm, or activeFilters change
  useEffect(() => {
    if (journals.length > 0) {
      applyFiltersAndSearch();
    }
  }, [journals, searchTerm, activeFilters]);

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

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  const applyFiltersAndSearch = () => {
    let results = [...journals];
    
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

  const toggleThemeMenu = () => {
    setShowThemeMenu(prev => !prev);
  };

  if (authLoading) {
    return <Spinner fullPage />;
  }

  return (
    <div className="app">
      <Navbar 
        theme={theme}
        handleThemeChange={handleThemeChange}
        showThemeMenu={showThemeMenu}
        toggleThemeMenu={toggleThemeMenu}
        themeMenuRef={themeMenuRef}
        isAuthenticated={isAuthenticated}
      />
      
      <main>
        <header className="page-header">
          <h1>Available Journals</h1>
          <p>Access peer-reviewed journals across various disciplines. Browse our collection of scientific journals and submit your articles</p>
        </header>
        
        <JournalFilters
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          categories={categories}
          tags={tags}
          loading={metadataLoading}
        />
        
        <JournalList 
          journals={filteredJournals}
          loading={loading}
          error={error}
          pagination={pagination}
          formatDate={formatDate}
          fetchJournals={fetchJournals}
          handlePageChange={handlePageChange}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
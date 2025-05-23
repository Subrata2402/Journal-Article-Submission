import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoDocumentTextOutline, IoCalendarOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoTimerOutline, IoChatbubbleOutline } from 'react-icons/io5';
import Spinner from '../common/Spinner';
import { formatDate } from '../../utils/formatters';
import articleService from '../../services/articleService';
import toastUtil from '../../utils/toastUtil';
import ArticleFilters from './ArticleFilters';

const EditorArticleList = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: { from: '', to: '' }
  });
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });  // Status badge colors
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'under review': return 'info';
      case 'submitted': return 'secondary';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  };

  useEffect(() => {
    fetchEditorArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      applyFiltersAndSearch();
    }
  }, [searchTerm, filters, articles]);

  const fetchEditorArticles = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null); // Clear error state when starting a new fetch
    try {
      const result = await articleService.getEditorArticles(page, limit);
      if (result.success) {
        setArticles(result.data.articles);
        setFilteredArticles(result.data.articles);
        setPagination(result.data.pagination);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (err) {
      console.error('Error fetching editor articles:', err);
      setError('An error occurred while fetching articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const applyFiltersAndSearch = () => {
    let results = [...articles];
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      results = results.filter(article => 
        article.title?.toLowerCase().includes(term) || 
        article.abstract?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      results = results.filter(article => article.status.toLowerCase() === filters.status.toLowerCase());
    }
    
    // Apply date range filters
    if (filters.dateRange.from || filters.dateRange.to) {
      results = results.filter(article => {
        const createdDate = new Date(article.createdAt);
        
        if (filters.dateRange.from && filters.dateRange.to) {
          const fromDate = new Date(filters.dateRange.from);
          const toDate = new Date(filters.dateRange.to);
          // Make toDate inclusive of the whole day
          toDate.setHours(23, 59, 59, 999);
          return createdDate >= fromDate && createdDate <= toDate;
        }
        
        if (filters.dateRange.from) {
          const fromDate = new Date(filters.dateRange.from);
          return createdDate >= fromDate;
        }
        
        if (filters.dateRange.to) {
          const toDate = new Date(filters.dateRange.to);
          // Make toDate inclusive of the whole day
          toDate.setHours(23, 59, 59, 999);
          return createdDate <= toDate;
        }
        
        return true;
      });
    }
    
    setFilteredArticles(results);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchEditorArticles(newPage, pagination.limit);
  };

  const handleViewArticle = (articleId) => {
    navigate(`/articles/${articleId}`);
  };  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': 
        return <IoCheckmarkCircleOutline className="status-icon approved" />;
      case 'pending': 
        return <IoTimerOutline className="status-icon pending" />;
      case 'under review': 
        return <IoTimerOutline className="status-icon info" />;
      case 'submitted': 
        return <IoTimerOutline className="status-icon secondary" />;
      case 'rejected': 
        return <IoCloseCircleOutline className="status-icon rejected" />;
      default:
        return <IoTimerOutline className="status-icon pending" />;
    }
  };

  return (
    <div className="editor-article-list">
      <div className="list-header">
        <h2>Articles for Review</h2>
        <ArticleFilters
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner size="medium" />
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="retry-button" onClick={() => fetchEditorArticles()}>
            Try Again
          </button>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <IoDocumentTextOutline />
          </div>
          <h3>No Articles Found</h3>
          <p>
            {searchTerm.trim() || filters.status || filters.dateRange.from || filters.dateRange.to
              ? "No articles match your search criteria."
              : "There are no articles assigned to you for review."}
          </p>
        </div>
      ) : (
        <>
          <div className="articles-table-container">
            <table className="articles-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Comments</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article._id}>
                    <td className="article-title-cell">
                      <div className="article-title">
                        {article.title}
                      </div>
                      {article.abstract && (
                        <div className="article-abstract">
                          {article.abstract.length > 150 
                            ? `${article.abstract.substring(0, 150)}...` 
                            : article.abstract}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="meta-date">
                        <IoCalendarOutline />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-with-icon">
                        {getStatusIcon(article.status)}
                        <span className={`status-badge ${getStatusColor(article.status)}`}>
                          {article.status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="article-comment">
                        {article.comment ? (
                          <div className="comment-content">
                            <IoChatbubbleOutline className="comment-icon" />
                            <span className="comment-text">{article.comment}</span>
                          </div>
                        ) : (
                          <span className="no-comment">No comments</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="article-actions">
                        <button
                          className="action-button view"
                          title="View Article"
                          onClick={() => handleViewArticle(article._id)}
                        >
                          <IoDocumentTextOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="pagination-button"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditorArticleList;
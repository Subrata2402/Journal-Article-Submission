import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoDocumentTextOutline, IoPencilOutline, IoTrashOutline, IoCalendarOutline } from 'react-icons/io5';
import Spinner from '../common/Spinner';
import ConfirmationModal from '../common/ConfirmationModal';
import { formatDate } from '../../utils/formatters';
import articleService from '../../services/articleService';
import toastUtil from '../../utils/toastUtil';
import ArticleFilters from './ArticleFilters';

const UserArticleList = () => {
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
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    articleId: null,
    articleTitle: ''
  });
  const [deleteLoading, setDeleteLoading] = useState(false);  // Status badge colors
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'under review': return 'info';
      case 'submitted': return 'secondary';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  };

  useEffect(() => {
    fetchUserArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      applyFiltersAndSearch();
    }
  }, [searchTerm, filters, articles]);

  const fetchUserArticles = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null); // Clear error state when starting a new fetch
    try {
      const result = await articleService.getUserArticles(page, limit);
      if (result.success) {
        setArticles(result.data.articles);
        setFilteredArticles(result.data.articles);
        setPagination(result.data.pagination);
      } else {
        setError('Failed to fetch articles');
      }
    } catch (err) {
      console.error('Error fetching user articles:', err);
      setError('An error occurred while fetching your articles. Please try again later.');
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
    fetchUserArticles(newPage, pagination.limit);
  };

  const handleViewArticle = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleEditArticle = (articleId) => {
    navigate(`/articles/${articleId}/edit`, { 
      state: { referrer: '/articles' } 
    });
  };

  const handleDeleteArticle = (article) => {
    setDeleteModal({
      isOpen: true,
      articleId: article._id,
      articleTitle: article.title
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      articleId: null,
      articleTitle: ''
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.articleId || deleteLoading) return;
    
    setDeleteLoading(true);
    
    try {
      const result = await articleService.deleteArticle(deleteModal.articleId);
      
      if (result.success) {
        // Remove the article from the state
        const updatedArticles = articles.filter(article => article._id !== deleteModal.articleId);
        setArticles(updatedArticles);
        
        // Show success message
        toastUtil.success(result.message || 'Article deleted successfully');
      } else {
        toastUtil.error(result.message || 'Failed to delete article');
      }
    } catch (error) {
      toastUtil.error('An error occurred while deleting the article');
      console.error('Delete article error:', error);
    } finally {
      setDeleteLoading(false);
      closeDeleteModal();
    }
  };

  return (
    <div className="user-article-list">
      <div className="list-header">
        <h2>My Submitted Articles</h2>
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
          <button className="retry-button" onClick={() => fetchUserArticles()}>
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
              : "You haven't submitted any articles yet."}
          </p>
          <Link to="/add-article" className="cta-button">
            Submit New Article
          </Link>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article._id} onClick={() => handleViewArticle(article._id)} style={{ cursor: 'pointer' }}>
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
                      <span className={`status-badge ${getStatusColor(article.status)}`}>
                        {article.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="article-actions">
                        <button
                          className="action-button view"
                          title="View Article"
                          onClick={() => handleViewArticle(article._id)}
                        >
                          <IoDocumentTextOutline />
                        </button>
                        {article.status !== 'approved' && (
                          <button
                            className="action-button edit"
                            title="Edit Article"
                            onClick={() => handleEditArticle(article._id)}
                          >
                            <IoPencilOutline />
                          </button>
                        )}
                        {article.status !== 'approved' && (
                          <button
                            className="action-button delete"
                            title="Delete Article"
                            onClick={() => handleDeleteArticle(article)}
                          >
                            <IoTrashOutline />
                          </button>
                        )}
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
          
          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={deleteModal.isOpen}
            onClose={closeDeleteModal}
            onConfirm={confirmDelete}
            title="Delete Article"
            message={`Are you sure you want to delete "${deleteModal.articleTitle}"? This action cannot be undone.`}
            confirmText={deleteLoading ? "Deleting..." : "Delete"}
            cancelText="Cancel"
            type="danger"
          />
        </>
      )}
    </div>
  );
};

export default UserArticleList;
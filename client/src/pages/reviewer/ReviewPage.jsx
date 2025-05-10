import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import articleService from '../../services/articleService';
import '../../assets/styles/article/userArticleList.scss';
import '../../assets/styles/pages/reviewer.scss';

const ReviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allArticles, setAllArticles] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [activeTab, setActiveTab] = useState('all');
  const [filteredArticles, setFilteredArticles] = useState([]);

  // Check if user has reviewer role and fetch data only once on page load
  useEffect(() => {
    if (!user || user.role !== 'reviewer') {
      navigate('/');
    } else {
      // Fetch all articles once
      fetchAllArticles();
    }
  }, [user, navigate]);
  
  // Apply tab filtering when tab or articles change
  useEffect(() => {
    if (allArticles.length > 0) {
      filterArticlesByTab();
    }
  }, [activeTab, allArticles, searchTerm]);

  // Fetch all articles from API - called only once when component mounts
  const fetchAllArticles = async () => {
    try {
      setIsLoading(true);
      const response = await articleService.getReviewArticles();
      
      if (response.success) {
        setAllArticles(response.articles);
        setPagination(response.pagination);
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: response.message || 'Failed to fetch articles for review'
        });
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to fetch articles for review'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter articles based on the selected tab - client-side filtering
  const filterArticlesByTab = () => {
    if (!allArticles || allArticles.length === 0) {
      setFilteredArticles([]);
      return;
    }

    // First apply the tab filter
    let result;
    switch (activeTab) {
      case 'pending':
        // Filter for pending articles - where reviewers[i].reviewed is false for current user
        result = allArticles.filter(article => !article.reviewers[0].reviewed);
        break;
      case 'completed':
        // Filter for completed articles - where reviewers[i].reviewed is true for current user
        result = allArticles.filter(article => article.reviewers[0].reviewed);
        break;
      case 'all':
      default:
        // Show all articles assigned to this reviewer
        result = [...allArticles];
        break;
    }

    // Then apply the search filter if needed
    if (searchTerm) {
      result = result.filter(article => 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticles(result);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
    // We're not fetching new data from API when changing pages
    // This is now handled client-side
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    // The filtering will be handled by the useEffect that depends on searchTerm
  };
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // The filtering will be handled by the useEffect that depends on activeTab
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Handle navigate to review article page
  const handleReviewArticle = (articleId, e) => {
    e.stopPropagation(); // Prevent row click event
    navigate(`/review/${articleId}`);
  };

  // Get the current page of articles for pagination
  const getCurrentPageArticles = () => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredArticles.slice(startIndex, endIndex);
  };
  
  // Calculate total pages based on filtered articles
  const totalPages = Math.ceil(filteredArticles.length / pagination.limit);
  const currentPageArticles = getCurrentPageArticles();

  return (
    <div className="content-container">
      <header className="page-header">
        <h1>Articles for Review</h1>
        <p>Review and provide feedback on submitted articles</p>
      </header>

      {alert.show && (
        <Alert 
          type={alert.type} 
          onClose={() => setAlert({ show: false })} 
          message={alert.message}
        />
      )}

      <div className="article-list-container">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All Articles
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            Pending
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => handleTabChange('completed')}
          >
            Completed
          </button>
        </div>
        
        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search articles by title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <Spinner size="medium" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IoDocumentTextOutline />
            </div>
            <h3>No Articles Found</h3>
            <p>
              {searchTerm.trim() 
                ? "No articles match your search criteria."
                : activeTab === 'pending'
                  ? "You don't have any pending articles to review." 
                  : activeTab === 'completed'
                    ? "You haven't completed any article reviews yet."
                    : "No articles have been assigned to you for review."}
            </p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageArticles.map(article => (
                    <tr 
                      key={article._id} 
                      className="article-row" 
                      onClick={() => navigate(`/review/${article._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className="title-cell">
                        <div className="article-title">
                          {article.title}
                        </div>
                      </td>
                      <td>
                        <div className="article-date">
                          {formatDate(article.createdAt)}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${article.status}`}>
                          {article.status?.charAt(0).toUpperCase() + article.status?.slice(1) || 'N/A'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="action-buttons">
                          <button 
                            className="action-button primary-button"
                            onClick={(e) => handleReviewArticle(article._id, e)}
                            title="Review Article"
                          >
                            <FiEye /> Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  title="Previous Page"
                >
                  <FiChevronLeft />
                </button>
                
                <div className="pagination-info">
                  Page <span className="pagination-current">{pagination.page}</span> of{" "}
                  <span className="pagination-total">{totalPages}</span>
                </div>
                
                <button
                  className="pagination-btn"
                  disabled={pagination.page === totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  title="Next Page"
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
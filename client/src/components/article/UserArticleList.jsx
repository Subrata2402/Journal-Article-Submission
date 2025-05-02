import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoDocumentTextOutline, IoPencilOutline, IoTrashOutline, IoSearchOutline, IoFilterOutline, IoCalendarOutline } from 'react-icons/io5';
import Spinner from '../common/Spinner';
import { formatDate } from '../../utils/formatters';
import articleService from '../../services/articleService';

const UserArticleList = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Status badge colors
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  };

  useEffect(() => {
    fetchUserArticles();
  }, []);

  useEffect(() => {
    if (articles.length > 0) {
      applySearch();
    }
  }, [searchTerm, articles]);

  const fetchUserArticles = async (page = 1, limit = 10) => {
    setLoading(true);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applySearch = () => {
    if (!searchTerm.trim()) {
      setFilteredArticles(articles);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = articles.filter(article => 
      article.title?.toLowerCase().includes(term) || 
      article.abstract?.toLowerCase().includes(term)
    );
    
    setFilteredArticles(filtered);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchUserArticles(newPage, pagination.limit);
  };

  const handleViewArticle = (articleId) => {
    navigate(`/articles/${articleId}`);
  };

  const handleEditArticle = (articleId) => {
    // To be implemented
    console.log('Edit article:', articleId);
  };

  const handleDeleteArticle = (articleId) => {
    // To be implemented
    console.log('Delete article:', articleId);
  };

  return (
    <div className="user-article-list">
      <div className="list-header">
        <h2>My Submitted Articles</h2>
        <div className="search-container">
          <div className="search-input-wrapper">
            <IoSearchOutline className="search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
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
            {searchTerm.trim() 
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
                            onClick={() => handleDeleteArticle(article._id)}
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
        </>
      )}
    </div>
  );
};

export default UserArticleList;
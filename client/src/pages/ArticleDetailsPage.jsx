import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoPersonOutline, 
  IoArrowBackOutline,
  IoDocumentTextOutline,
  IoMailOutline,
  IoBusinessOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoNewspaperOutline,
  IoSchoolOutline
} from 'react-icons/io5';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Spinner from '../components/common/Spinner';
import useTheme from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import articleService from '../services/articleService';
import { formatDate } from '../utils/formatters';
import '../assets/styles/article/articleDetails.scss';

const ArticleDetailsPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme, handleThemeChange } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = React.useRef(null);
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleThemeMenu = () => {
    setShowThemeMenu(prev => !prev);
  };

  useEffect(() => {
    if (articleId) {
      fetchArticleDetails(articleId);
    }
  }, [articleId]);

  const fetchArticleDetails = async (id) => {
    setLoading(true);
    try {
      const result = await articleService.getArticleById(id);
      if (result.success) {
        setArticle(result.data);
      } else {
        setError('Failed to fetch article details');
      }
    } catch (err) {
      console.error('Error fetching article details:', err);
      setError('An error occurred while fetching article details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  };

  // Handle file download
  const handleFileDownload = (filename) => {
    if (!filename) return;
    
    // Construct file URL
    const fileUrl = `${process.env.REACT_APP_API_URL || ''}/uploads/${filename}`;
    
    // Open file in new tab
    window.open(fileUrl, '_blank');
  };

  const goBack = () => {
    navigate('/articles');
  };

  // If authentication is loading, show spinner
  if (authLoading) {
    return <Spinner fullPage />;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" />;
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
      
      <main className="main-content">
        <div className="content-container">
          <div className="article-details-page">
            <div className="back-button-container">
              <button className="back-button" onClick={goBack}>
                <IoArrowBackOutline /> Back to Articles
              </button>
            </div>

            {loading ? (
              <div className="loading-container">
                <Spinner size="medium" />
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button className="retry-button" onClick={() => fetchArticleDetails(articleId)}>
                  Try Again
                </button>
              </div>
            ) : article ? (
              <div className="article-details">
                <div className="article-header">
                  <div className="article-title-section">
                    <h1>{article.title}</h1>
                    <span className={`status-badge ${getStatusColor(article.status)}`}>
                      {article.status}
                    </span>
                  </div>

                  <div className="article-meta">
                    <div className="meta-item">
                      <IoCalendarOutline className="meta-icon" />
                      <span>Submitted on {formatDate(article.createdAt)}</span>
                    </div>
                    {article.updatedAt && article.updatedAt !== article.createdAt && (
                      <div className="meta-item">
                        <IoTimeOutline className="meta-icon" />
                        <span>Updated on {formatDate(article.updatedAt)}</span>
                      </div>
                    )}
                    <div className="meta-item">
                      <IoNewspaperOutline className="meta-icon" />
                      <span>Journal: {article.journalId?.title || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="article-content">
                  <div className="article-section">
                    <h2>Abstract</h2>
                    <p className="article-abstract">{article.abstract}</p>
                  </div>

                  {article.keywords && article.keywords.length > 0 && (
                    <div className="article-section">
                      <h2>Keywords</h2>
                      <div className="article-keywords">
                        {article.keywords.map((keyword, index) => (
                          <span key={index} className="keyword-tag">{keyword}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {article.authors && article.authors.length > 0 && (
                    <div className="article-section">
                      <h2>Authors</h2>
                      <div className="authors-list">
                        {article.authors.map((author, index) => (
                          <div key={index} className="author-card">
                            <div className="author-name">
                              <IoPersonOutline className="author-icon" />
                              <strong>{author.firstName} {author.lastName}</strong>
                              {author.firstAuthor && <span className="author-badge primary">First Author</span>}
                              {author.correspondingAuthor && <span className="author-badge secondary">Corresponding Author</span>}
                            </div>
                            <div className="author-details">
                              <div className="author-detail">
                                <IoMailOutline className="detail-icon" />
                                <span>{author.email}</span>
                              </div>
                              {author.affiliation && (
                                <div className="author-detail">
                                  <IoSchoolOutline className="detail-icon" />
                                  <span>{author.affiliation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="article-section">
                    <h2>Submitter Information</h2>
                    <div className="submitter-info">
                      <div className="submitter-detail">
                        <IoPersonOutline className="detail-icon" />
                        <span>
                          <strong>Name:</strong> {article.userId?.firstName} {article.userId?.middleName} {article.userId?.lastName}
                        </span>
                      </div>
                      <div className="submitter-detail">
                        <IoMailOutline className="detail-icon" />
                        <span>
                          <strong>Email:</strong> {article.userId?.email?.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="article-section files-section">
                    <h2>Article Files</h2>
                    <div className="article-files">
                      {article.menuScript && (
                        <div className="file-item">
                          <IoDocumentTextOutline className="file-icon" />
                          <div className="file-details">
                            <span className="file-name">Manuscript</span>
                            <button 
                              className="download-button"
                              onClick={() => handleFileDownload(article.menuScript)}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {article.coverLetter && (
                        <div className="file-item">
                          <IoDocumentTextOutline className="file-icon" />
                          <div className="file-details">
                            <span className="file-name">Cover Letter</span>
                            <button 
                              className="download-button"
                              onClick={() => handleFileDownload(article.coverLetter)}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {article.supplementaryFile && (
                        <div className="file-item">
                          <IoDocumentTextOutline className="file-icon" />
                          <div className="file-details">
                            <span className="file-name">Supplementary Material</span>
                            <button 
                              className="download-button"
                              onClick={() => handleFileDownload(article.supplementaryFile)}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {article.comment && (
                    <div className="article-section">
                      <h2>Editor's Comment</h2>
                      <div className="editor-comment">
                        <p>{article.comment}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="not-found">
                <h2>Article Not Found</h2>
                <p>The article you are looking for does not exist or has been removed.</p>
                <button className="back-link" onClick={goBack}>
                  View All Articles
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetailsPage;
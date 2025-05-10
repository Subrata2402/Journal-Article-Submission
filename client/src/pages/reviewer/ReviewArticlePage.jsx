import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  IoArrowBackOutline,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoNewspaperOutline,
  IoTimerOutline,
  IoSaveOutline,
  IoCheckmarkDoneCircleOutline
} from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import TextArea from '../../components/forms/TextArea';
import articleService from '../../services/articleService';
import { formatDate } from '../../utils/formatters';
import '../../assets/styles/article/articleDetails.scss';
import { ARTICLE_MENUSCRIPT_PATH } from '../../config/constants';

const ReviewArticlePage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [reviewData, setReviewData] = useState({
    status: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);

  // Check if user has reviewer role and fetch article details
  useEffect(() => {
    if (!user || user.role !== 'reviewer') {
      navigate('/');
      return;
    }
    
    const fetchArticleDetails = async () => {
      try {
        setIsLoading(true);
        // Since there's no specific API for reviewers to fetch article details,
        // we'll use data from the articles list that was previously loaded
        const reviewArticles = await articleService.getReviewArticles();
        if (reviewArticles.success) {
          const foundArticle = reviewArticles.articles.find(a => a._id === articleId);
          if (foundArticle) {
            setArticle(foundArticle);
            
            // Check if this article has already been reviewed by the current user
            const reviewed = foundArticle.reviewers?.[0]?.reviewed;
            
            if (reviewed) {
              setHasReviewed(true);
              setExistingReview({
                status: foundArticle.reviewers?.[0]?.status || 'N/A',
                comment: foundArticle.reviewers?.[0]?.comment || 'No comments provided',
                reviewedAt: foundArticle.reviewers?.[0]?.reviewedAt || foundArticle.createdAt
              });
            }
          } else {
            setAlert({
              show: true,
              type: 'error',
              message: 'Article not found or you do not have permission to review it.'
            });
          }
        } else {
          setAlert({
            show: true,
            type: 'error',
            message: 'Failed to load article details.'
          });
        }
      } catch (error) {
        console.error('Error fetching article details:', error);
        setAlert({
          show: true,
          type: 'error',
          message: error.message || 'Failed to load article details'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleDetails();
  }, [articleId, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const setReviewStatus = (status) => {
    setReviewData(prevState => ({
      ...prevState,
      status
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewData.status) {
      toast.error('Please select a review decision.');
      return;
    }
    
    if (!reviewData.comment.trim()) {
      toast.error('Please provide review comments.');
      return;
    }
    
    try {
      setSubmitting(true);
      const response = await articleService.submitReview(
        articleId,
        reviewData.status,
        reviewData.comment
      );
      
      if (response.success) {
        toast.success('Review submitted successfully');
        navigate('/review'); // Navigate back to reviews list
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'An error occurred while submitting your review');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle file download
  const handleFileDownload = (filename) => {
    if (!filename) return;
    const fileUrl = `${ARTICLE_MENUSCRIPT_PATH}/${filename}`;
    window.open(fileUrl, '_blank');
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      case 'accept-with-change': return 'success-light';
      case 'border-line': return 'warning';
      default: return 'info';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': 
        return <IoCheckmarkCircleOutline className="status-icon approved" />;
      case 'pending': 
        return <IoTimerOutline className="status-icon pending" />;
      case 'rejected': 
        return <IoCloseCircleOutline className="status-icon rejected" />;
      case 'accept-with-change':
        return <IoCheckmarkCircleOutline className="status-icon success-light" />;
      case 'border-line':
        return <IoTimerOutline className="status-icon warning" />;
      default: 
        return <IoNewspaperOutline className="status-icon" />;
    }
  };

  // Get human readable status
  const getReadableStatus = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'accept-with-change': return 'Accept with Change';
      case 'border-line': return 'Border Line';
      case 'pending': return 'Pending';
      default: return status || 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="centered-spinner">
        <Spinner />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="content-container">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate('/review')}>
            <IoArrowBackOutline /> Back to Articles
          </button>
        </div>
        <Alert 
          type="error"
          message="Article not found or you do not have permission to review it."
        />
      </div>
    );
  }

  return (
    <div className="content-container">
      <div className="article-details-page">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate('/review')}>
            <IoArrowBackOutline /> Back to Review List
          </button>
        </div>

        {alert.show && (
          <Alert 
            type={alert.type} 
            onClose={() => setAlert({ show: false })} 
            message={alert.message}
          />
        )}

        <div className="article-details">
          {/* Article Header */}
          <div className="article-header">
            <div className="article-title-section">
              <h1>{article.title}</h1>
              <span className={`status-badge ${getStatusColor(article.status)}`}>
                {getStatusIcon(article.status)} {article.status}
              </span>
            </div>

            <div className="article-meta">
              <div className="meta-item">
                <IoCalendarOutline className="meta-icon" />
                <span>Submitted on {formatDate(article.createdAt)}</span>
              </div>
              <div className="meta-item">
                <IoNewspaperOutline className="meta-icon" />
                <span>Journal: {article.journalId?.title || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="article-content">
            <div className="article-section">
              <h2>Abstract</h2>
              <p className="article-abstract">{article.abstract || 'No abstract provided'}</p>
            </div>

            {article.menuScript && (
              <div className="article-section files-section">
                <h2>Article Files</h2>
                <div className="article-files">
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
                </div>
              </div>
            )}

            {/* Review Form or Existing Review Section */}
            <div className="article-section editor-controls">
              <div className="editor-control-section">
                {hasReviewed ? (
                  // Display existing review
                  <div className="submitted-review">
                    <h2>Your Review</h2>
                    
                    <div className="review-status-section">
                      <div className="review-status-header">
                        <IoCheckmarkDoneCircleOutline size={24} className="completed-icon" />
                        <h3>Review Completed</h3>
                      </div>
                      <p className="review-submitted-date">
                        Review submitted on {formatDate(existingReview.reviewedAt)}
                      </p>
                    </div>
                    
                    <div className="review-details">
                      <div className="review-decision">
                        <h4>Your Decision</h4>
                        <div className={`review-status-badge ${getStatusColor(existingReview.status)}`}>
                          {getStatusIcon(existingReview.status)}
                          {getReadableStatus(existingReview.status)}
                        </div>
                      </div>
                      
                      <div className="review-comment-section">
                        <h4>Your Comments</h4>
                        <div className="review-comment">
                          {existingReview.comment}
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate('/review')}
                      >
                        Back to Review List
                      </button>
                    </div>
                  </div>
                ) : (
                  // Display review submission form
                  <>
                    <h2>Submit Your Review</h2>

                    <form onSubmit={handleSubmitReview} className="status-controls">
                      <div className="status-selection">
                        <label>Review Decision:</label>
                        <div className="decision-buttons">
                          <button
                            type="button"
                            className={`status-btn ${reviewData.status === 'accepted' ? 'success' : ''}`}
                            onClick={() => setReviewStatus('accepted')}
                          >
                            <IoCheckmarkCircleOutline size={18} /> Accepted
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${reviewData.status === 'accept-with-change' ? 'success-light' : ''}`}
                            onClick={() => setReviewStatus('accept-with-change')}
                          >
                            <IoCheckmarkCircleOutline size={18} /> Accept with Change
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${reviewData.status === 'border-line' ? 'warning' : ''}`}
                            onClick={() => setReviewStatus('border-line')}
                          >
                            <IoTimerOutline size={18} /> Border Line
                          </button>
                          <button
                            type="button"
                            className={`status-btn ${reviewData.status === 'rejected' ? 'danger' : ''}`}
                            onClick={() => setReviewStatus('rejected')}
                          >
                            <IoCloseCircleOutline size={18} /> Rejected
                          </button>
                        </div>
                      </div>
                      
                      <div className="comment-input">
                        <TextArea
                          name="comment"
                          label="Review Comments"
                          value={reviewData.comment}
                          onChange={handleInputChange}
                          placeholder="Provide your detailed review comments here..."
                          rows={6}
                          required
                        />
                      </div>
                      
                      <div className="form-actions">
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => navigate('/review')}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="primary-button"
                          disabled={submitting || !reviewData.status || !reviewData.comment.trim()}
                        >
                          {submitting ? (
                            <>
                              <Spinner size="small" /> Submitting...
                            </>
                          ) : (
                            <>
                              <IoSaveOutline /> Submit Review
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewArticlePage;
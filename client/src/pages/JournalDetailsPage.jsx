import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  IoCalendarOutline, 
  IoArrowBackOutline,
  IoBookmarkOutline,
  IoBookmark,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoAccessibilityOutline,
  IoStatsChartOutline,
} from 'react-icons/io5';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/formatters';
import journalService from '../services/journalService';
import toastUtil from '../utils/toastUtil';
import { useAuth } from '../contexts/AuthContext';
import '../assets/styles/journal/journalDetails.scss';

const JournalDetailsPage = () => {
  const { journalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPinnedState, setIsPinnedState] = useState(false);

  // Check if user is an editor
  const isEditor = user && user.role === "editor";

  useEffect(() => {
    if (journalId) {
      fetchJournalDetails(journalId);
    }
  }, [journalId]);

  useEffect(() => {
    // Update pinned state when journal is loaded
    if (journal) {
      setIsPinnedState(journalService.isPinned(journal._id));
    }
  }, [journal]);

  const fetchJournalDetails = async (id) => {
    setLoading(true);
    try {
      const result = await journalService.getJournalById(id);
      if (result.success) {
        setJournal(result.data);
      } else {
        setError('Failed to fetch journal details');
      }
    } catch (err) {
      console.error('Error fetching journal details:', err);
      setError('An error occurred while fetching journal details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to convert category to title case
  const toTitleCase = (str) => {
    if (!str) return 'N/A';
    return str === 'N/A' ? str : str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Function to determine header color based on category
  const getCategoryClass = (category) => {
    switch(category?.toLowerCase()) {
      case 'science': return 'science';
      case 'medicine': return 'medicine';
      case 'psychology': return 'psychology';
      default: return 'science'; // Default color
    }
  };

  // Function to handle navigation to add article page with selected journal
  const handleSubmitArticle = () => {
    navigate(`/add-article?journalId=${journalId}`);
  };

  // Function to handle pinning/unpinning journals
  const handleTogglePinJournal = () => {
    if (!journal) return;
    
    const currentPinned = journalService.isPinned(journal._id);
    journalService.togglePinJournal(journal._id);
    
    // Update local state to reflect the change
    setIsPinnedState(!currentPinned);
    
    toastUtil.success(currentPinned 
      ? 'Journal unpinned successfully' 
      : 'Journal pinned successfully');
  };
  
  const isPinned = () => {
    return isPinnedState;
  };

  return (
    <div className="journal-details-page">
      <div className="back-button-container">
        <button 
          className="back-button" 
          onClick={() => navigate('/')}
          aria-label="Back to journals"
        >
          <IoArrowBackOutline /> Back to Journals
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner size="medium" />
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="retry-button" onClick={() => fetchJournalDetails(journalId)}>
            Try Again
          </button>
        </div>
      ) : !journal ? (
        <div className="not-found">
          <h2>Journal Not Found</h2>
          <p>The journal you are looking for does not exist or has been removed.</p>
          <button className="back-link" onClick={() => navigate('/')}>
            Go Back to Journals
          </button>
        </div>
      ) : (
        <div className="journal-details-container">
          <div className={`journal-header ${getCategoryClass(journal.category)}`}>
            <div className="header-content">
              <div className="journal-title-section">
                <h1>{journal.title}</h1>
                {journal.category && (
                  <div className="journal-category">
                    <span className="category-badge">{toTitleCase(journal.category)}</span>
                  </div>
                )}
              </div>
              <div className="journal-actions">
                <button 
                  className={`bookmark-button ${isPinned() ? 'active' : ''}`} 
                  onClick={handleTogglePinJournal}
                  title={isPinned() ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isPinned() ? <IoBookmark /> : <IoBookmarkOutline />}
                  <span>{isPinned() ? 'Pinned' : 'Pin Journal'}</span>
                </button>
                {!isEditor && (
                  <button 
                    className="submit-article-button"
                    onClick={handleSubmitArticle}
                  >
                    Submit Article
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="journal-content">
            <div className="journal-section">
              <h2>Description</h2>
              <p className="journal-description">{journal.description}</p>
            </div>

            <div className="journal-section">
              <h2>Journal Details</h2>
              <div className="journal-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <IoCalendarOutline />
                  </div>
                  <div className="detail-content">
                    <h3>Published</h3>
                    <p>{formatDate(journal.publishedDate || journal.createdAt)}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <IoTimeOutline />
                  </div>
                  <div className="detail-content">
                    <h3>Frequency</h3>
                    <p>{journal.publicationFrequency || 'Not specified'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <IoAccessibilityOutline />
                  </div>
                  <div className="detail-content">
                    <h3>Open Access</h3>
                    <p>{journal.openAccess ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <IoCheckmarkCircleOutline />
                  </div>
                  <div className="detail-content">
                    <h3>Peer Review Process</h3>
                    <p>{journal.peerReviewProcess || 'Not specified'}</p>
                  </div>
                </div>

                {journal.impactFactor && (
                  <div className="detail-item">
                    <div className="detail-icon">
                      <IoStatsChartOutline />
                    </div>
                    <div className="detail-content">
                      <h3>Impact Factor</h3>
                      <p>{journal.impactFactor.value} ({journal.impactFactor.year})</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {journal.metrics && (
              <div className="journal-section">
                <h2>Journal Metrics</h2>
                <div className="metrics-grid">
                  <div className="metric-item">
                    <h3>Average Review Time</h3>
                    <p>{journal.metrics.averageReviewTime}</p>
                  </div>
                  <div className="metric-item">
                    <h3>Acceptance Rate</h3>
                    <p>{journal.metrics.acceptanceRate}</p>
                  </div>
                  <div className="metric-item">
                    <h3>Time to Publication</h3>
                    <p>{journal.metrics.timeToPublication}</p>
                  </div>
                  <div className="metric-item">
                    <h3>Articles per Year</h3>
                    <p>{journal.metrics.articlesPerYear}</p>
                  </div>
                </div>
              </div>
            )}

            {journal.submissionGuidelines && journal.submissionGuidelines.length > 0 && (
              <div className="journal-section">
                <h2>Submission Guidelines</h2>
                <div className="guidelines-list">
                  <ul>
                    {journal.submissionGuidelines.map((guideline, index) => (
                      <li key={index}>{guideline}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {journal.tags && journal.tags.length > 0 && (
              <div className="journal-section">
                <h2>Tags</h2>
                <div className="tags-container">
                  {journal.tags.map((tag, index) => (
                    <span key={index} className="tag-pill">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalDetailsPage;
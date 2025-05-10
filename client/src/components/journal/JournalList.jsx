import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { IoBookmarkOutline, IoBookmark, IoCalendarOutline, IoPricetagOutline, IoNewspaperOutline, IoPencilOutline, IoTrashOutline, IoEllipsisVertical, IoEyeOutline } from 'react-icons/io5';
import '../../assets/styles/journal/journalList.scss';
import journalService from '../../services/journalService';
import toastUtil from '../../utils/toastUtil';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmationModal from '../common/ConfirmationModal';
import { toTitleCase } from '../../utils/formatters';

const JournalList = ({ 
  journals, 
  loading, 
  error, 
  pagination, 
  formatDate, 
  fetchJournals, 
  handlePageChange, 
  onPinStatusChange,
  showPinnedOnly 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, journalId: null, title: '' });
  
  // Check if user is an editor or admin
  const isEditor = user && user.role === "editor";
  const isAdmin = user && user.role === "admin";
  
  // Function to determine header color based on category
  const getCategoryClass = (category) => {
    switch(category?.toLowerCase()) {
      case 'science': return 'science';
      case 'medicine': return 'medicine';
      case 'psychology': return 'psychology';
      default: return 'science'; // Default color
    }
  };
  
  // Function to handle navigation to journal details page
  const handleViewDetails = (journalId) => {
    navigate(`/view-journal/${journalId}`);
  };
  
  // Function to handle navigation to add article page with selected journal
  const handleSubmitArticle = (journalId) => {
    navigate(`/add-article?journalId=${journalId}`);
  };
  
  // Function to handle pinning/unpinning journals
  const handleTogglePinJournal = (e, journalId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isPinned = journalService.isPinned(journalId);
    journalService.togglePinJournal(journalId);
    
    toastUtil.success(isPinned 
      ? 'Journal unpinned successfully' 
      : 'Journal pinned successfully');
      
    // Notify parent component to update pinned status
    if (onPinStatusChange) {
      onPinStatusChange();
    }
    
    // Close dropdown if open
    setActiveDropdown(null);
  };
  
  const isPinnedJournal = (journalId) => {
    return journalService.isPinned(journalId);
  };
  
  // Toggle dropdown menu
  const toggleDropdown = (e, journalId) => {
    e.preventDefault();
    e.stopPropagation();
    
    setActiveDropdown(activeDropdown === journalId ? null : journalId);
  };
  
  // Close dropdown when clicking elsewhere
  const handleOutsideClick = () => {
    setActiveDropdown(null);
  };
  
  // Handle journal edit
  const handleEditJournal = (e, journalId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-journal/${journalId}`);
    setActiveDropdown(null);
  };
  
  // Open delete confirmation modal
  const confirmDeleteJournal = (e, journal) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDeleteModal({
      show: true,
      journalId: journal._id,
      title: journal.title
    });
    
    setActiveDropdown(null);
  };
  
  // Handle journal delete
  const handleDeleteJournal = async () => {
    try {
      const response = await journalService.deleteJournal(deleteModal.journalId);
      if (response.success) {
        toastUtil.success('Journal deleted successfully');
        fetchJournals(); // Refresh the journals list
      } else {
        toastUtil.error(response.message || 'Failed to delete journal');
      }
    } catch (error) {
      console.error('Error deleting journal:', error);
      toastUtil.error(error.message || 'An error occurred while deleting the journal');
    } finally {
      setDeleteModal({ show: false, journalId: null, title: '' });
    }
  };
  
  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({ show: false, journalId: null, title: '' });
  };
  
  // Add click event listener to close dropdown when clicking outside
  React.useEffect(() => {
    if (activeDropdown) {
      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    }
  }, [activeDropdown]);
  
  return (
    <section className="journal-list">          
      {loading ? (
        <div className="loading-indicator">
          <Spinner size="medium" color="primary" />
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="secondary-button" onClick={() => fetchJournals()}>
            Try Again
          </button>
        </div>
      ) : journals.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <IoNewspaperOutline />
          </div>
          <h3 className="empty-state-title">No Journals Found</h3>
          <p className="empty-state-description">
            {showPinnedOnly 
              ? "You haven't pinned any journals yet."
              : "We couldn't find any journals matching your criteria. Try adjusting your filters or search terms."}
          </p>
        </div>
      ) : (
        <>
          <div className="journal-grid">
            {journals.map(journal => (
              <div className={`journal-card ${isPinnedJournal(journal._id) ? 'pinned' : ''}`} key={journal._id}>
                <div className={`journal-card-header ${getCategoryClass(journal.category)}`}>
                  <div className="journal-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      <path d="M3 9h18"></path>
                      <path d="M9 21V9"></path>
                    </svg>
                  </div>
                  {journal.category && journal.category !== 'N/A' && (
                    <div className="journal-category-badge">
                      {toTitleCase(journal.category)}
                    </div>
                  )}
                </div>
                
                <div className="journal-card-content">
                  <h3 className="journal-title">
                    {journal.title || "Untitled Journal"}
                  </h3>
                  
                  <p className="journal-description">
                    {journal.description || "No description available."}
                  </p>
                  
                  <div className="journal-footer">
                    <div className="journal-meta">
                      <div className="meta-item">
                        <IoCalendarOutline />
                        <span>Published: {formatDate(journal.publishedDate || journal.createdAt)}</span>
                      </div>
                      
                      {journal.tags && journal.tags.length > 0 ? (
                        <div className="meta-item tags-item">
                          <IoPricetagOutline />
                          <span className="tags-container">
                            {journal.tags.map((tag, index) => (
                              <span key={index} className="journal-tag">{toTitleCase(tag)}</span>
                            ))}
                          </span>
                        </div>
                      ) : null}
                    </div>
                    
                    <div className="journal-actions">
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleViewDetails(journal._id)} 
                          className="view-details-button"
                        >
                          <IoEyeOutline /> View Details
                        </button>
                        
                        {/* Show Submit Article button only for regular users (not editors or admins) */}
                        {!isEditor && !isAdmin && (
                          <button 
                            className="submit-article-button"
                            onClick={() => handleSubmitArticle(journal._id)}
                          >
                            Submit Article
                          </button>
                        )}
                      </div>
                      
                      {/* Show three-dots menu for admin users */}
                      {isAdmin ? (
                        <div className="admin-actions">
                          <button 
                            className="menu-button"
                            onClick={(e) => toggleDropdown(e, journal._id)}
                            aria-label="Journal options"
                          >
                            <IoEllipsisVertical />
                          </button>
                          
                          {activeDropdown === journal._id && (
                            <div className="dropdown-menu">
                              <button 
                                onClick={(e) => handleTogglePinJournal(e, journal._id)}
                                className="dropdown-item"
                              >
                                {isPinnedJournal(journal._id) ? (
                                  <>
                                    <IoBookmark /> Unpin Journal
                                  </>
                                ) : (
                                  <>
                                    <IoBookmarkOutline /> Pin Journal
                                  </>
                                )}
                              </button>
                              <button 
                                onClick={(e) => handleEditJournal(e, journal._id)}
                                className="dropdown-item"
                              >
                                <IoPencilOutline /> Edit Journal
                              </button>
                              <button 
                                onClick={(e) => confirmDeleteJournal(e, journal)}
                                className="dropdown-item delete"
                              >
                                <IoTrashOutline /> Delete Journal
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Regular bookmark button for non-admin users
                        <button 
                          className={`bookmark-button ${isPinnedJournal(journal._id) ? 'active' : ''}`} 
                          aria-label={isPinnedJournal(journal._id) ? 'Unpin' : 'Pin'}
                          onClick={(e) => handleTogglePinJournal(e, journal._id)}
                          title={isPinnedJournal(journal._id) ? 'Unpin journal' : 'Pin journal'}
                        >
                          {isPinnedJournal(journal._id) ? <IoBookmark /> : <IoBookmarkOutline />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            isOpen={deleteModal.show}
            onClose={closeDeleteModal}
            onConfirm={handleDeleteJournal}
            title="Delete Journal"
            message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            type="danger"
          />
        </>
      )}
    </section>
  );
};

export default JournalList;
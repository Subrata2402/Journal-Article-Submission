import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IoCalendarOutline,
  IoPersonOutline,
  IoArrowBackOutline,
  IoDocumentTextOutline,
  IoMailOutline,
  IoTimeOutline,
  IoNewspaperOutline,
  IoSchoolOutline,
  IoPencilOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoAddCircleOutline,
  IoTrashOutline,
  IoSaveOutline,
  IoTimerOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoRefreshOutline,
  IoSettingsOutline,
  IoListOutline,
  IoInformationCircleOutline,
  IoPeopleOutline,
  IoFileTrayFullOutline,
  IoChatboxOutline,
  IoCloseOutline,
  IoWarningOutline
} from 'react-icons/io5';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../contexts/AuthContext';
import articleService from '../../services/articleService';
import { formatDate } from '../../utils/formatters';
import '../../assets/styles/article/articleDetails.scss';
import '../../assets/styles/article/articleDetailsUpdate.scss';
import CustomSelect from '../../components/forms/CustomSelect';
import {
  ARTICLE_COVER_LETTER_PATH,
  ARTICLE_MENUSCRIPT_PATH,
  ARTICLE_SUPPLEMENTARY_FILE_PATH
} from '../../config/constants';
import toastUtil from '../../utils/toastUtil';
import TextArea from '../../components/forms/TextArea';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import Alert from '../../components/common/Alert';

const ArticleDetailsPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewerForm, setShowReviewerForm] = useState(false);
  const [reviewersExpanded, setReviewersExpanded] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Review management state
  const [newReviewer, setNewReviewer] = useState({
    reviewerId: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [reviewers, setReviewers] = useState([]);
  const [availableReviewers, setAvailableReviewers] = useState([]);
  const [reviewerSearch, setReviewerSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Ref for detecting clicks outside of dropdown
  const dropdownRef = useRef(null);

  // Article status management state
  const [editorComment, setEditorComment] = useState('');
  const [articleStatus, setArticleStatus] = useState('');

  // Delete confirmation modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [reviewerToDelete, setReviewerToDelete] = useState(null);

  // Status update confirmation modal state
  const [statusUpdateModal, setStatusUpdateModal] = useState({
    show: false,
    status: '',
    comment: ''
  });

  // Check if user is an editor
  const isEditor = user && user.role === "editor";

  // Check if minimum reviewer requirement is met
  const hasMinimumReviewers = reviewers.length >= 3;

  useEffect(() => {
    if (articleId) {
      fetchArticleDetails(articleId);
      if (isEditor) {
        fetchAvailableReviewers();
      }
    }
  }, [articleId, isEditor]);

  // Handle outside clicks for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  // Set initial values when article data is loaded
  useEffect(() => {
    if (article) {
      setEditorComment(article.comment || '');
      setArticleStatus(article.status || 'pending');
      if (article.reviewers) {
        setReviewers(article.reviewers);
      }
    }
  }, [article]);

  const fetchArticleDetails = async (id) => {
    setLoading(true);
    setError(null);
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

  const fetchAvailableReviewers = async () => {
    try {
      const result = await articleService.getReviewerList();
      if (result.success) {
        setAvailableReviewers(result.data.reviewers || []);
      } else {
        toastUtil.error('Failed to load reviewers');
      }
    } catch (err) {
      console.error('Error fetching available reviewers:', err);
      toastUtil.error('Could not load available reviewers');
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'under review': return 'info';
      case 'rejected': return 'danger';
      default: return 'info';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <IoCheckmarkCircleOutline className="status-icon approved" />;
      case 'pending':
        return <IoTimerOutline className="status-icon pending" />;
      case 'under review':
        return <IoNewspaperOutline className="status-icon under-review" />;
      case 'rejected':
        return <IoCloseCircleOutline className="status-icon rejected" />;
      default:
        return <IoNewspaperOutline className="status-icon" />;
    }
  };

  // Handle file download
  const handleFileDownload = (filename, fileType) => {
    if (!filename) return;

    // Construct file URL
    let fileUrl;
    if (fileType === 'menuscript') {
      fileUrl = `${ARTICLE_MENUSCRIPT_PATH}/${filename}`;
    } else if (fileType === 'coverLetter') {
      fileUrl = `${ARTICLE_COVER_LETTER_PATH}/${filename}`;
    } else if (fileType === 'supplementary') {
      fileUrl = `${ARTICLE_SUPPLEMENTARY_FILE_PATH}/${filename}`;
    } else {
      return;
    }

    // Open file in new tab
    window.open(fileUrl, '_blank');
  };

  const goBack = () => {
    navigate('/articles');
  };

  const handleEditArticle = () => {
    navigate(`/articles/${articleId}/edit`, {
      state: { referrer: `/articles/${articleId}` }
    });
  };

  // Check if user can edit this article
  const canEditArticle = () => {
    if (!article || !user) return false;

    // For editors, they can't edit articles
    if (isEditor) {
      return false;
    }

    // For regular users, they can edit their own articles if not approved
    return article.status !== 'approved' && article.userId?._id === user._id;
  };

  // Editor functions for reviewer management
  const toggleReviewerForm = () => {
    setShowReviewerForm(!showReviewerForm);
  };

  const toggleReviewersSection = () => {
    setReviewersExpanded(!reviewersExpanded);
  };

  const addReviewer = async (e) => {
    e.preventDefault();

    if (!newReviewer.reviewerId) {
      toastUtil.error('Please select a reviewer');
      return;
    }

    // Check if reviewer is already assigned
    if (reviewers.some(r => r.reviewerId?._id === newReviewer.reviewerId)) {
      toastUtil.error('This reviewer is already assigned');
      return;
    }

    setSubmitLoading(true);

    try {
      // Call the updated API endpoint for adding a reviewer
      const result = await articleService.addReviewer(
        articleId,
        newReviewer.reviewerId
      );

      if (result.success) {
        // Create a new reviewer object to add to the UI
        const mockReviewer = {
          reviewerId: {
            _id: newReviewer.reviewerId,
            firstName: newReviewer.firstName,
            lastName: newReviewer.lastName
          },
          status: "pending",
          comment: "",
          reviewDate: null,
          reviewed: false,
          createdAt: new Date().toISOString(),
          _id: `reviewer-${Date.now()}`
        };

        const updatedReviewers = [...reviewers, mockReviewer];

        // Update local state
        setReviewers(updatedReviewers);
        setShowReviewerForm(false);
        setNewReviewer({
          reviewerId: '',
          firstName: '',
          lastName: '',
          email: ''
        });
        setArticle({
          ...article,
          reviewers: updatedReviewers
        });

        // Clear reviewer search
        setReviewerSearch('');

        toastUtil.success('Reviewer added successfully');
      } else {
        toastUtil.error(result.message || 'Failed to add reviewer');
      }
    } catch (err) {
      console.error('Error adding reviewer:', err);
      toastUtil.error('Failed to add reviewer');
    } finally {
      setSubmitLoading(false);
    }
  };

  const confirmDeleteReviewer = (reviewer) => {
    setReviewerToDelete(reviewer);
    setDeleteModalVisible(true);
  };

  const handleDeleteReviewer = async () => {
    if (!reviewerToDelete) return;

    try {
      // Call the updated API endpoint for removing a reviewer
      const result = await articleService.removeReviewer(
        articleId,
        reviewerToDelete.reviewerId._id
      );

      if (result.success) {
        // Update local state
        const updatedReviewers = reviewers.filter(r => r._id !== reviewerToDelete._id);
        setReviewers(updatedReviewers);
        setArticle({
          ...article,
          reviewers: updatedReviewers
        });

        toastUtil.success('Reviewer removed successfully');
      } else {
        toastUtil.error(result.message || 'Failed to remove reviewer');
      }
    } catch (err) {
      console.error('Error removing reviewer:', err);
      toastUtil.error('Failed to remove reviewer');
    } finally {
      setDeleteModalVisible(false);
      setReviewerToDelete(null);
    }
  };

  const cancelDeleteReviewer = () => {
    setDeleteModalVisible(false);
    setReviewerToDelete(null);
  };
  // Clear the reviewer search input and also clear selected reviewer
  const clearReviewerSearch = () => {
    setReviewerSearch('');
    // Also clear the selected reviewer when clearing search
    setNewReviewer({
      reviewerId: '',
      firstName: '',
      lastName: '',
      email: ''
    });
    // Focus back on the search input after clearing
    document.getElementById('reviewer-search')?.focus();
  };
  // Update article status and comments
  const updateArticleStatus = async () => {
    // If reviewers are less than 3, show confirmation modal first
    if (reviewers.length < 3) {
      setStatusUpdateModal({
        show: true,
        status: articleStatus,
        comment: editorComment
      });
      return;
    }

    // If we have enough reviewers, proceed directly
    await executeStatusUpdate(articleStatus, editorComment);
  };

  // Execute the actual status update after confirmation if needed
  const executeStatusUpdate = async (status, comment) => {
    setSubmitLoading(true);

    try {
      // Call the API to update article status and comment
      const result = await articleService.updateArticleStatus(articleId, {
        status: status,
        comment: comment
      });
      if (result.success) {
        // Update local state with the new values
        const updatedArticle = {
          ...article,
          status: status,
          comment: comment
        };

        setArticle(updatedArticle);
        toastUtil.success(result.message || 'Article status updated successfully');
      } else {
        toastUtil.error(result.message || 'Failed to update article status');
      }
    } catch (err) {
      console.error('Error updating article status:', err);
      toastUtil.error('Failed to update article status');
    } finally {
      setSubmitLoading(false);

      // Close the modal if it was open
      setStatusUpdateModal({
        show: false,
        status: '',
        comment: ''
      });
    }
  };

  const cancelStatusUpdate = () => {
    setStatusUpdateModal({
      show: false,
      status: '',
      comment: ''
    });
  };

  const confirmStatusUpdate = async () => {
    const { status, comment } = statusUpdateModal;
    await executeStatusUpdate(status, comment);
  };

  // If authentication is loading, show spinner
  if (authLoading) {
    return <Spinner fullPage />;
  }
  return (
    <div className="content-container">
      <div className="article-details-page">

        <div className="back-button-container">
          <button className="back-button" onClick={goBack}>
            <IoArrowBackOutline /> Back to Articles
          </button>

          {canEditArticle() && (
            <button className="edit-button" onClick={handleEditArticle}>
              <IoPencilOutline /> Edit Article
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <Spinner size="medium" />
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button className="retry-button" onClick={() => fetchArticleDetails(articleId)}>
              <IoRefreshOutline /> Try Again
            </button>
          </div>
        ) : article ? (<div className="article-details">
          {/* Article Header */}
          <div className="form-section article-header">
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
          </div>            {/* Editor Controls - Visible only for editors */}
          {isEditor && (
            <div className="editor-controls p-0">

              <div className="form-section editor-control-section">
                <h2 className="section-title">
                  <IoSettingsOutline className="section-icon" />
                  Editor Actions
                </h2>
                <div className="status-controls">
                  <div className="status-selection">
                    <CustomSelect
                      label="Article Status:"
                      name="articleStatus"
                      value={articleStatus} onChange={(e) => {
                        const newStatus = e.target.value;
                        // Set the status regardless
                        setArticleStatus(newStatus);
                      }}
                      options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'under review', label: 'Under Review' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'rejected', label: 'Rejected' }
                      ]}
                      searchable={false}
                      icon={<IoCheckmarkCircleOutline />}
                    />
                  </div>

                  <div className="comment-input">
                    <TextArea
                      label="Editor Comment:"
                      name="editorComment"
                      value={editorComment}
                      onChange={(e) => setEditorComment(e.target.value)}
                      placeholder="Add your comments here..."
                      rows={3}
                      icon={<IoChatboxOutline />}
                    />
                  </div>

                  <button
                    className="update-status-button primary-button"
                    onClick={updateArticleStatus}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <>
                        <Spinner size="small" /> Updating...
                      </>
                    ) : (
                      <>
                        <IoSaveOutline /> Update Status & Comment
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* Reviewers Section */}
              <div className="form-section reviewers-section">
                <h2 className="section-title" onClick={toggleReviewersSection}>
                  <IoPeopleOutline className="section-icon" />
                  Reviewers
                  {/* <span className={`reviewer-count ${reviewers.length < 3 ? 'warning' : 'success'}`}>
                    ({reviewers.length}/3 minimum required)
                  </span> */}
                  <button className="toggle-button">
                    {reviewersExpanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                  </button>
                </h2>
                {reviewersExpanded && (
                  <div className="reviewers-content">
                    {reviewers.length < 3 && (
                      <Alert
                        type="warning"
                        message={
                          <>
                            <strong>Reviewer Requirement:</strong> You must add at least 3 reviewers to this article.
                            Currently {reviewers.length} assigned of 3 required.
                          </>
                        }
                      />
                    )}
                    {/* Add Reviewer Button */}
                    <button
                      className={`add-reviewer-button ${reviewers.length < 3 ? 'primary-button' : 'secondary-button'}`}
                      onClick={toggleReviewerForm}
                    >
                      <IoAddCircleOutline /> {showReviewerForm ? 'Cancel' : 'Add Reviewer'}
                    </button>

                    {/* Add Reviewer Form */}
                    {showReviewerForm && (
                      <div className="form-section add-reviewer-form">
                        <h3 className="subsection-title">
                          <IoPersonOutline className="subsection-icon" />
                          Add New Reviewer
                        </h3>
                        <form onSubmit={addReviewer}>
                          <div className="form-group">
                            <label htmlFor="reviewer-search">Search and Select Reviewer:</label>
                            <div className="searchable-dropdown" ref={dropdownRef}>
                              <div className="search-input-container">
                                <input
                                  type="text"
                                  id="reviewer-search"
                                  placeholder="Search reviewers..."
                                  value={reviewerSearch}
                                  onChange={(e) => setReviewerSearch(e.target.value)}
                                  onFocus={() => setDropdownOpen(true)}
                                />
                                {reviewerSearch && (
                                  <button
                                    type="button"
                                    className="clear-search-button"
                                    onClick={clearReviewerSearch}
                                    title="Clear search"
                                  >
                                    <IoCloseOutline />
                                  </button>
                                )}
                              </div>

                              {dropdownOpen && (
                                <div className="dropdown-options">
                                  {availableReviewers
                                    .filter(reviewer => {
                                      const fullName = `${reviewer.firstName} ${reviewer.lastName}`.toLowerCase();
                                      const email = reviewer.email?.toLowerCase() || '';
                                      const searchTerm = reviewerSearch.toLowerCase();

                                      return fullName.includes(searchTerm) || email.includes(searchTerm);
                                    })
                                    .map(reviewer => (
                                      <div
                                        key={reviewer._id}
                                        className={`dropdown-option ${newReviewer.reviewerId === reviewer._id ? 'selected' : ''}`}
                                        onClick={() => {
                                          setNewReviewer({
                                            reviewerId: reviewer._id,
                                            firstName: reviewer.firstName,
                                            lastName: reviewer.lastName,
                                            email: reviewer.email || ''
                                          });
                                          setReviewerSearch(`${reviewer.firstName} ${reviewer.lastName}`);
                                          setDropdownOpen(false);
                                        }}
                                      >
                                        <div className="reviewer-name">{reviewer.firstName} {reviewer.lastName}</div>
                                        {reviewer.email && (
                                          <div className="reviewer-email">{reviewer.email}</div>
                                        )}
                                      </div>
                                    ))}

                                  {availableReviewers.filter(reviewer => {
                                    const fullName = `${reviewer.firstName} ${reviewer.lastName}`.toLowerCase();
                                    const email = reviewer.email?.toLowerCase() || '';
                                    const searchTerm = reviewerSearch.toLowerCase();

                                    return fullName.includes(searchTerm) || email.includes(searchTerm);
                                  }).length === 0 && (
                                      <div className="no-results">No reviewers found</div>
                                    )}
                                </div>
                              )}
                            </div>

                            {newReviewer.reviewerId && (
                              <div className="selected-reviewer">
                                Selected: <strong>{newReviewer.firstName} {newReviewer.lastName}</strong>
                              </div>
                            )}
                          </div>

                          <div className="form-actions">
                            <button
                              type="submit"
                              className="primary-button"
                              disabled={submitLoading || !newReviewer.reviewerId}
                            >
                              {submitLoading ? (
                                <>
                                  <Spinner size="small" /> Adding...
                                </>
                              ) : (
                                <>
                                  <IoAddCircleOutline /> Add Reviewer
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => setShowReviewerForm(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Reviewers List */}
                    {reviewers && reviewers.length > 0 ? (
                      <div className="form-section reviewers-list">
                        <h3 className="subsection-title">
                          <IoListOutline className="subsection-icon" />
                          Assigned Reviewers
                        </h3>
                        <table className="reviewers-table">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Status</th>
                              <th>Review Date</th>
                              <th>Comment</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reviewers.map((reviewer) => (
                              <tr key={reviewer._id}>
                                <td>
                                  <div className="reviewer-name-cell">
                                    <IoPersonOutline className="reviewer-icon" />
                                    {reviewer.reviewerId?.firstName} {reviewer.reviewerId?.lastName}
                                  </div>
                                </td>
                                <td>
                                  <span className={`status-badge ${getStatusColor(reviewer.status)}`}>
                                    {reviewer.status}
                                  </span>
                                </td>
                                <td>
                                  {reviewer.reviewDate ? formatDate(reviewer.reviewDate) : 'Not reviewed yet'}
                                </td>
                                <td className="reviewer-comment">
                                  {reviewer.comment || 'No comment provided'}
                                </td>
                                <td>
                                  <button
                                    className="remove-reviewer-button"
                                    onClick={() => confirmDeleteReviewer(reviewer)}
                                    title="Remove reviewer"
                                  >
                                    <IoTrashOutline />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="form-section no-reviewers-message">
                        <p>No reviewers assigned to this article yet.</p>
                        <Alert type="warning" icon={<IoWarningOutline />}>
                          A minimum of 1 reviewer is required for the article to be reviewed.
                        </Alert>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Article Content - Standard content for all users */}            <div className="article-content">
            {/* Article sections with updated styles */}
            <div className="form-section article-section">
              <h2 className="section-title">
                <IoInformationCircleOutline className="section-icon" />
                Abstract
              </h2>
              <p className="article-abstract">{article.abstract}</p>
            </div>

            {article.keywords && article.keywords.length > 0 && (
              <div className="form-section article-section">
                <h2 className="section-title">
                  <IoListOutline className="section-icon" />
                  Keywords
                </h2>
                <div className="article-keywords">
                  {article.keywords.map((keyword, index) => (
                    <span key={index} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            )}

            {article.authors && article.authors.length > 0 && (
              <div className="form-section article-section">
                <h2 className="section-title">
                  <IoPeopleOutline className="section-icon" />
                  Authors
                </h2>
                <div className="authors-list">
                  {article.authors.map((author, index) => (
                    <div key={index} className="author-card">
                      <div className="author-name">
                        <IoPersonOutline className="author-icon" />
                        <strong>{author.firstName} {author.lastName}</strong>
                        {author.firstAuthor && <span className="author-badge primary">First Author</span>}
                        {author.correspondingAuthor && <span className="author-badge secondary">Corresponding Author</span>}
                        {author.otherAuthor && <span className="author-badge tertiary">Other Author</span>}
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
            )}              <div className="form-section article-section">
              <h2 className="section-title">
                <IoPersonOutline className="section-icon" />
                Submitter Information
              </h2>
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

            <div className="form-section article-section files-section">
              <h2 className="section-title">
                <IoFileTrayFullOutline className="section-icon" />
                Article Files
              </h2>
              <div className="article-files">
                {article.menuScript && (
                  <div className="file-item">
                    <IoDocumentTextOutline className="file-icon" />
                    <div className="file-details">
                      <span className="file-name">Manuscript</span>
                      <button
                        className="download-button"
                        onClick={() => handleFileDownload(article.menuScript, 'menuscript')}
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
                        onClick={() => handleFileDownload(article.coverLetter, 'coverLetter')}
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
                        onClick={() => handleFileDownload(article.supplementaryFile, 'supplementary')}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Show editor comment for both user and editor */}
            {article.comment && (
              <div className="form-section article-section">
                <h2 className="section-title">
                  <IoChatboxOutline className="section-icon" />
                  Editor's Comment
                </h2>
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

      {/* Confirmation modal for removing reviewers */}
      <ConfirmationModal
        isOpen={deleteModalVisible}
        onClose={cancelDeleteReviewer}
        onConfirm={handleDeleteReviewer}
        title="Remove Reviewer"
        message={`Are you sure you want to remove ${reviewerToDelete?.reviewerId?.firstName} ${reviewerToDelete?.reviewerId?.lastName} as a reviewer?`}
        confirmText="Remove"
        cancelText="Cancel"
        type="danger"
      />

      {/* Confirmation modal for status updates with insufficient reviewers */}
      <ConfirmationModal
        isOpen={statusUpdateModal.show}
        onClose={cancelStatusUpdate}
        onConfirm={confirmStatusUpdate}
        title="Reviewer Requirement Warning"
        message={
          <div className="status-update-warning">
            <p><strong>Warning:</strong> This article has fewer than the required minimum of 3 reviewers ({reviewers.length} currently assigned).</p>
            <p>It is recommended to assign at least 3 reviewers before updating the article status.</p>
            <p>Do you still want to proceed with updating the article status?</p>
          </div>
        }
        confirmText="Update Anyway"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default ArticleDetailsPage;
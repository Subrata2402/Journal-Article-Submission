import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import reviewerService from '../../services/reviewerService';
import { useAuth } from '../../contexts/AuthContext';
import FormField from '../../components/forms/FormField';
import Alert from '../../components/common/Alert';
import Spinner from '../../components/common/Spinner';
import DragDropFileUpload from '../../components/common/DragDropFileUpload';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import '../../assets/styles/pages/reviewer.scss';

const ReviewerPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('add');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    affiliation: ''
  });
  const [reviewers, setReviewers] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    reviewerId: null,
    reviewerName: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [addMethod, setAddMethod] = useState('single'); // 'single' or 'bulk'

  // Check if user has editor role
  useEffect(() => {
    if (!user || user.role !== 'editor') {
      navigate('/');
    } else {
      // Fetch initial reviewer list
      fetchReviewers(1);
    }
  }, [user, navigate]);

  // Fetch reviewers with pagination
  const fetchReviewers = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await reviewerService.getReviewers(page, pagination.limit);
      
      if (response.success) {
        setReviewers(response.reviewers || []);
        setPagination(response.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to fetch reviewers'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchReviewers(newPage);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    // Clear previous alerts
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await reviewerService.addReviewer(formData);
      
      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message: response.message
      });
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        affiliation: ''
      });
      
      // Refresh reviewer list if we are on the first page
      if (pagination.page === 1) {
        fetchReviewers(1);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      
      // Show error message
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'An error occurred while adding the reviewer'
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // When search term changes, reset to page 1
  useEffect(() => {
    if (searchTerm === '') {
      fetchReviewers(1);
    }
  }, [searchTerm]);

  // Open delete confirmation modal
  const openDeleteModal = (reviewer) => {
    setDeleteModal({
      show: true,
      reviewerId: reviewer._id,
      reviewerName: `${reviewer.firstName} ${reviewer.lastName}`
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      show: false,
      reviewerId: null,
      reviewerName: ''
    });
  };

  // Handle delete reviewer
  const handleDeleteReviewer = async () => {
    if (!deleteModal.reviewerId) return;
    
    setIsDeleting(true);
    
    try {
      const response = await reviewerService.deleteReviewer(deleteModal.reviewerId);
      
      // Close modal
      closeDeleteModal();
      
      // Show success message
      setAlert({
        show: true,
        type: 'success',
        message: response.message || 'Reviewer deleted successfully'
      });
      
      // Refresh reviewer list
      // If we're on a page with only one item and it's not page 1, go to previous page
      if (reviewers.length === 1 && pagination.page > 1) {
        fetchReviewers(pagination.page - 1);
      } else {
        fetchReviewers(pagination.page);
      }
    } catch (error) {
      console.error("Error deleting reviewer:", error);
      
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to delete reviewer'
      });
      
      // Close modal
      closeDeleteModal();
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter reviewers based on search term
  const filteredReviewers = useMemo(() => {
    if (!searchTerm.trim()) return reviewers;
    
    const lowerSearch = searchTerm.toLowerCase();
    return reviewers.filter(reviewer => 
      `${reviewer.firstName} ${reviewer.lastName}`.toLowerCase().includes(lowerSearch) ||
      reviewer.email.toLowerCase().includes(lowerSearch) ||
      reviewer.affiliation.toLowerCase().includes(lowerSearch)
    );
  }, [reviewers, searchTerm]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setAlert({ show: false });
    } else {
      setSelectedFile(null);
      setAlert({
        show: true,
        type: 'error',
        message: 'Please select a valid CSV file'
      });
    }
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setAlert({
        show: true,
        type: 'error',
        message: 'Please select a CSV file to upload'
      });
      return;
    }

    setUploadingFile(true);
    setAlert({ show: false });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await reviewerService.addBulkReviewers(formData);
      
      setAlert({
        show: true,
        type: 'success',
        message: `${response.message} (${response.data?.length || 0} reviewers added)`
      });
      
      // Reset file input
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh reviewer list
      fetchReviewers(1);
    } catch (error) {
      console.error('Error uploading CSV file:', error);
      
      setAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to upload reviewers'
      });
    } finally {
      setUploadingFile(false);
    }
  };

  // Toggle between single and bulk add methods
  const toggleAddMethod = (method) => {
    setAddMethod(method);
    setAlert({ show: false });
  };

  // Handle template download
  const handleTemplateDownload = (e) => {
    e.preventDefault();
    
    // Get the CSV template file from the public folder
    const templateUrl = '/reviewerlist.csv';
    
    // Create a link element
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = 'reviewerlist.csv';
    
    // Add the link to the document, click it, then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reviewer-container">
      <h1 className="page-title">Reviewer Management</h1>
      
      <div className="tab-container">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Reviewer
          </button>
          <button 
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            Reviewer List
          </button>
        </div>
        
        {activeTab === 'add' && (
          <div className="add-reviewer-container">
            <h2 className="form-title">Add New Reviewer</h2>
            
            {alert.show && activeTab === 'add' && (
              <Alert 
                type={alert.type} 
                onClose={() => setAlert({ show: false })} 
                message={alert.message}
                autoClose={alert.type === 'success'}
                autoCloseDelay={3000}
              />
            )}
            
            <div className="add-method-toggle">
              <button 
                className={`method-toggle-btn ${addMethod === 'single' ? 'active' : ''}`}
                onClick={() => toggleAddMethod('single')}
              >
                Add Single Reviewer
              </button>
              <button 
                className={`method-toggle-btn ${addMethod === 'bulk' ? 'active' : ''}`}
                onClick={() => toggleAddMethod('bulk')}
              >
                Bulk Upload (CSV)
              </button>
            </div>
            
            {addMethod === 'single' ? (
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <FormField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                  
                  <FormField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                  
                  <FormField
                    label="Affiliation"
                    name="affiliation"
                    value={formData.affiliation}
                    onChange={handleChange}
                    placeholder="Enter institution or organization"
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit"
                    className='primary-button submit-button'
                    disabled={formSubmitting}
                    isLoading={formSubmitting}
                  >
                    Add Reviewer
                  </button>
                </div>
              </form>
            ) : (
              <div className="bulk-upload-container">
                <div className="csv-info">
                  <h3>CSV File Format</h3>
                  <p>Your CSV file must include the following columns:</p>
                  <ul>
                    <li>First Name (required)</li>
                    <li>Last Name (required)</li>
                    <li>Email (required)</li>
                    <li>Affiliation (required)</li>
                  </ul>
                  <p className="note">Note: The first row should contain the column headers.</p>
                </div>
                
                <div className="file-upload-area">
                  <DragDropFileUpload
                    title="CSV File Upload"
                    name="reviewersCsv"
                    acceptedFormats=".csv"
                    value={selectedFile}
                    onChange={handleFileChange}
                    error={null}
                  />
                  
                  <button
                    type="button"
                    className="primary-button upload-button"
                    onClick={handleFileUpload}
                    disabled={!selectedFile || uploadingFile}
                    isLoading={uploadingFile}
                  >
                    Upload & Add Reviewers
                  </button>
                </div>
                
                <div className="csv-template">
                  <p>Don't have a CSV file? <a href="" onClick={handleTemplateDownload}>Download template</a></p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'list' && (
          <div className="reviewer-list-container">
            <h2 className="form-title">Reviewer List</h2>
            
            {alert.show && activeTab === 'list' && (
              <Alert 
                type={alert.type} 
                onClose={() => setAlert({ show: false })} 
                message={alert.message}
                autoClose={alert.type === 'success'}
                autoCloseDelay={3000}
              />
            )}
            
            <div className="search-container">
              <div className="search-input-wrapper">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search reviewers by name, email or affiliation..."
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
              <div className="centered-spinner">
                <Spinner />
              </div>
            ) : filteredReviewers.length === 0 ? (
              <div className="no-results">
                {searchTerm ? (
                  <p>No reviewers found matching your search criteria.</p>
                ) : (
                  <p>No reviewers found. Add some reviewers to get started.</p>
                )}
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="reviewer-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Affiliation</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReviewers.map(reviewer => (
                        <tr key={reviewer._id}>
                          <td>
                            <div className="reviewer-name">
                              {`${reviewer.firstName} ${reviewer.lastName}`}
                            </div>
                          </td>
                          <td>
                            <a href={`mailto:${reviewer.email}`} className="reviewer-email">
                              {reviewer.email}
                            </a>
                          </td>
                          <td>
                            <div className="reviewer-affiliation">
                              {reviewer.affiliation}
                            </div>
                          </td>
                          <td className="actions-cell">
                            <button 
                              className="icon-btn delete-btn"
                              title="Delete Reviewer"
                              onClick={() => openDeleteModal(reviewer)}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {!searchTerm && pagination.totalPages > 1 && (
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
                      <span className="pagination-total">{pagination.totalPages}</span>
                    </div>
                    
                    <button
                      className="pagination-btn"
                      disabled={pagination.page === pagination.totalPages}
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
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.show}
        title="Delete Reviewer"
        message={`Are you sure you want to delete ${deleteModal.reviewerName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteReviewer}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default ReviewerPage;
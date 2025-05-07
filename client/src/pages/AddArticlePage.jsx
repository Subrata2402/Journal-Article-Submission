import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  IoDocumentTextOutline, 
  IoNewspaperOutline,
  IoPersonOutline,
  IoSchoolOutline,
  IoMailOutline,
  IoCheckmarkCircleOutline,
  IoAddCircleOutline,
  IoCloseCircleOutline,
} from 'react-icons/io5';
import FormField from '../components/forms/FormField';
import TextArea from '../components/forms/TextArea';
import DragDropFileUpload from '../components/common/DragDropFileUpload';
import Spinner from '../components/common/Spinner';
import { useAuth } from '../contexts/AuthContext';
import httpService from '../services/httpService';
import { API_ENDPOINTS } from '../config/api';
import toastUtil from '../utils/toastUtil';
import '../assets/styles/pages/addArticle.scss';

const AddArticlePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    journalId: '',
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({
    menuScript: null,
    coverLetter: null,
    supplementaryFile: null
  });
  const [authors, setAuthors] = useState([
    {
      firstName: '',
      lastName: '',
      email: '',
      affiliation: '',
      correspondingAuthor: false,
      firstAuthor: true,
      otherAuthor: false
    }
  ]);
  
  useEffect(() => {
    fetchJournals();
    
    // Get journalId from URL parameters if available
    const params = new URLSearchParams(location.search);
    const journalId = params.get('journalId');
    
    if (journalId) {
      setFormData(prev => ({
        ...prev,
        journalId: journalId
      }));
    }
  }, [location.search]);
  
  const fetchJournals = async () => {
    try {
      const response = await httpService.get(API_ENDPOINTS.JOURNALS.LIST);
      if (response.data.success) {
        setJournals(response.data.data.journals);
      } else {
        console.error('Failed to fetch journals:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoadingJournals(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleFileChange = (e) => {
    const { name, files: uploadedFiles } = e.target;
    if (uploadedFiles.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: uploadedFiles[0]
      }));
      
      // Clear file errors
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };
  
  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: value
    };
    setAuthors(updatedAuthors);
    
    // Clear author errors if any
    if (errors[`authors.${index}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`authors.${index}.${field}`];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (index, field) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = {
      ...updatedAuthors[index],
      [field]: !updatedAuthors[index][field]
    };
    
    // If this is firstAuthor and we're setting it to true, set all others to false
    if (field === 'firstAuthor' && updatedAuthors[index][field]) {
      updatedAuthors.forEach((author, i) => {
        if (i !== index) {
          updatedAuthors[i] = {
            ...author,
            firstAuthor: false
          };
        }
      });
    }
    
    // If this is correspondingAuthor and we're setting it to true, set all others to false
    if (field === 'correspondingAuthor' && updatedAuthors[index][field]) {
      updatedAuthors.forEach((author, i) => {
        if (i !== index) {
          updatedAuthors[i] = {
            ...author,
            correspondingAuthor: false
          };
        }
      });
    }
    
    setAuthors(updatedAuthors);
  };
  
  const addAuthor = () => {
    setAuthors(prev => [
      ...prev,
      {
        firstName: '',
        lastName: '',
        email: '',
        affiliation: '',
        correspondingAuthor: false,
        firstAuthor: false,
        otherAuthor: false
      }
    ]);
  };
  
  const removeAuthor = (index) => {
    if (authors.length > 1) {
      const updatedAuthors = authors.filter((_, i) => i !== index);
      
      // Check if we're removing a first author, and if so, set the first author to the first in the list
      if (authors[index].firstAuthor && updatedAuthors.length > 0) {
        updatedAuthors[0] = {
          ...updatedAuthors[0],
          firstAuthor: true
        };
      }
      
      // Check if we're removing a corresponding author
      if (authors[index].correspondingAuthor && updatedAuthors.length > 0) {
        updatedAuthors[0] = {
          ...updatedAuthors[0],
          correspondingAuthor: true
        };
      }
      
      setAuthors(updatedAuthors);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Validate abstract
    if (!formData.abstract.trim()) {
      newErrors.abstract = 'Abstract is required';
    } else if (formData.abstract.trim().length < 100) {
      newErrors.abstract = 'Abstract should be at least 100 characters';
    }
    
    // Validate keywords - now required and limited to maximum 6 keywords
    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    } else {
      const keywordsCount = formData.keywords.split(',').filter(k => k.trim()).length;
      if (keywordsCount > 6) {
        newErrors.keywords = 'Maximum 6 keywords allowed';
      }
    }
    
    // Validate journal selection
    if (!formData.journalId) {
      newErrors.journalId = 'Please select a journal';
    }
    
    // Validate files - manual validation since we removed the required attribute
    if (!files.menuScript) {
      newErrors.menuScript = 'Manuscript file is required';
      // Focus on the add manuscript button if there's an error
      document.querySelector('button[aria-label="Browse for Manuscript"]')?.focus();
    }
    
    if (!files.coverLetter) {
      newErrors.coverLetter = 'Cover letter is required';
      // Only focus if manuscript is valid but cover letter isn't
      if (!newErrors.menuScript) {
        document.querySelector('button[aria-label="Browse for Cover Letter"]')?.focus();
      }
    }
    
    // Validate authors
    authors.forEach((author, index) => {
      if (!author.firstName.trim()) {
        newErrors[`authors.${index}.firstName`] = 'First name is required';
      }
      
      if (!author.lastName.trim()) {
        newErrors[`authors.${index}.lastName`] = 'Last name is required';
      }
      
      if (!author.email.trim()) {
        newErrors[`authors.${index}.email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(author.email)) {
        newErrors[`authors.${index}.email`] = 'Email is invalid';
      }
      
      if (!author.affiliation.trim()) {
        newErrors[`authors.${index}.affiliation`] = 'Affiliation is required';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toastUtil.error('Please correct the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create FormData object
      const data = new FormData();
      data.append('title', formData.title);
      data.append('abstract', formData.abstract);
      
      // Parse keywords from comma-separated string to array
      if (formData.keywords.trim()) {
        const keywords = formData.keywords.split(',').map(k => k.trim());
        data.append('keywords', JSON.stringify(keywords));
      }
      
      data.append('journalId', formData.journalId);
      
      // Add files
      if (files.menuScript) {
        data.append('menuScript', files.menuScript, files.menuScript.name);
      }
      
      if (files.coverLetter) {
        data.append('coverLetter', files.coverLetter, files.coverLetter.name);
      }
      
      if (files.supplementaryFile) {
        data.append('supplementaryFile', files.supplementaryFile, files.supplementaryFile.name);
      }
      
      // Add authors as JSON string
      data.append('authors', JSON.stringify(authors));
      
      // Make API request using FormData
      const response = await httpService.post(API_ENDPOINTS.ARTICLES.SUBMIT, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        toastUtil.success('Article submitted successfully');
        navigate('/articles');
      } else {
        toastUtil.error(response.data.message || 'Failed to submit article');
      }
    } catch (error) {
      console.error('Error submitting article:', error);
      toastUtil.error(error.response?.data?.message || 'An error occurred while submitting the article');
    } finally {
      setLoading(false);
    }
  };
  
  // Add a new useEffect for real-time keywords validation
  useEffect(() => {
    if (formData.keywords) {
      const keywordsArr = formData.keywords.split(',').filter(k => k.trim());
      if (keywordsArr.length > 6) {
        // If more than 6 keywords, truncate to 6 and show error
        const truncatedKeywords = keywordsArr.slice(0, 6).join(', ');
        setFormData(prev => ({
          ...prev,
          keywords: truncatedKeywords
        }));
        setErrors(prev => ({
          ...prev,
          keywords: 'Maximum 6 keywords allowed'
        }));
      }
    }
  }, [formData.keywords]);
  
  // If authentication is loading, show spinner
  if (authLoading) {
    return <Spinner fullPage />;
  }

  return (
    <>
      <header className="page-header">
        <h1>Submit New Article</h1>
        <p>Complete the form below to submit your article for review</p>
      </header>
      
      <div className="content-container">
        <div className="add-article-form-container">
          <form onSubmit={handleSubmit} className="add-article-form">
            <div className="form-section">
              <h2 className="section-title">
                <IoNewspaperOutline className="section-icon" />
                Article Information
              </h2>
              
              <FormField
                label="Article Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the complete title of your article"
                error={errors.title}
                required
              />
              
              <TextArea
                label="Abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                placeholder="Provide a concise summary of your article"
                rows={6}
                error={errors.abstract}
                required
              />
              
              <FormField
                label="Keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                placeholder="Enter keywords separated by commas (e.g., Psychology, Research, Methods)"
                error={errors.keywords}
                required
              />
              
              <div className="form-field">
                <label htmlFor="journalId" className="form-field__label">
                  Select Journal
                  <span className="form-field__required">*</span>
                </label>
                
                <select
                  id="journalId"
                  name="journalId"
                  value={formData.journalId}
                  onChange={handleInputChange}
                  className="form-field__select"
                  disabled={loadingJournals}
                  required
                >
                  <option value="">-- Select a Journal --</option>
                  {journals.map(journal => (
                    <option key={journal._id} value={journal._id}>
                      {journal.title}
                    </option>
                  ))}
                </select>
                
                {errors.journalId && <div className="form-field__error">{errors.journalId}</div>}
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="section-title">
                <IoDocumentTextOutline className="section-icon" />
                Upload Files
              </h2>
              
              <div className="file-uploads-row">
                <DragDropFileUpload
                  title="Manuscript"
                  name="menuScript"
                  acceptedFormats=".pdf"
                  value={files.menuScript}
                  onChange={handleFileChange}
                  error={errors.menuScript}
                  required={true}
                />
                
                <DragDropFileUpload
                  title="Cover Letter"
                  name="coverLetter"
                  acceptedFormats=".pdf"
                  value={files.coverLetter}
                  onChange={handleFileChange}
                  error={errors.coverLetter}
                  required={true}
                />
                
                <DragDropFileUpload
                  title="Supplementary Files"
                  name="supplementaryFile"
                  acceptedFormats=".pdf,.doc,.docx,.xls,.xlsx"
                  value={files.supplementaryFile}
                  onChange={handleFileChange}
                  error={errors.supplementaryFile}
                  required={false}
                />
              </div>
            </div>
            
            <div className="form-section authors-section">
              <div className="section-title-with-action">
                <h2 className="section-title">
                  <IoPersonOutline className="section-icon" />
                  Authors
                </h2>
                
                <button 
                  type="button" 
                  className="add-author-button" 
                  onClick={addAuthor}
                >
                  <IoAddCircleOutline /> Add Author
                </button>
              </div>
              
              {authors.map((author, index) => (
                <div key={index} className="author-card">
                  <div className="author-card-header">
                    <h3>Author {index + 1}</h3>
                    
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-author-button"
                        onClick={() => removeAuthor(index)}
                      >
                        <IoCloseCircleOutline /> Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="author-form-row">
                    <FormField
                      label="First Name"
                      name={`firstName-${index}`}
                      value={author.firstName}
                      onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                      placeholder="First Name"
                      error={errors[`authors.${index}.firstName`]}
                      required
                    />
                    
                    <FormField
                      label="Last Name"
                      name={`lastName-${index}`}
                      value={author.lastName}
                      onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                      placeholder="Last Name"
                      error={errors[`authors.${index}.lastName`]}
                      required
                    />
                  </div>
                  
                  <div className="author-form-row">
                    <FormField
                      label="Email"
                      name={`email-${index}`}
                      type="email"
                      value={author.email}
                      onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                      placeholder="Email Address"
                      error={errors[`authors.${index}.email`]}
                      required
                      icon={<IoMailOutline />}
                    />
                    
                    <FormField
                      label="Affiliation"
                      name={`affiliation-${index}`}
                      value={author.affiliation}
                      onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                      placeholder="University or Institution"
                      error={errors[`authors.${index}.affiliation`]}
                      required
                      icon={<IoSchoolOutline />}
                    />
                  </div>
                  
                  <div className="author-checkboxes">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`firstAuthor-${index}`}
                        checked={author.firstAuthor}
                        onChange={() => handleCheckboxChange(index, 'firstAuthor')}
                      />
                      <label htmlFor={`firstAuthor-${index}`}>First Author</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`correspondingAuthor-${index}`}
                        checked={author.correspondingAuthor}
                        onChange={() => handleCheckboxChange(index, 'correspondingAuthor')}
                      />
                      <label htmlFor={`correspondingAuthor-${index}`}>Corresponding Author</label>
                    </div>
                    
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`otherAuthor-${index}`}
                        checked={author.otherAuthor}
                        onChange={() => handleCheckboxChange(index, 'otherAuthor')}
                      />
                      <label htmlFor={`otherAuthor-${index}`}>Other Author</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="secondary-button" 
                onClick={() => navigate('/articles')}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                className="primary-button" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="small" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircleOutline />
                    Submit Article
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddArticlePage;
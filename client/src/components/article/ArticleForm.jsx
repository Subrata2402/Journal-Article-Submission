import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoDocumentTextOutline,
  IoNewspaperOutline,
  IoPersonOutline,
  IoSchoolOutline,
  IoMailOutline,
  IoCheckmarkCircleOutline,
  IoAddCircleOutline,
  IoCloseCircleOutline,
  IoArrowBackOutline,
  IoTextOutline,
  IoBookOutline,
  IoPricetagOutline,
  IoCloudUploadOutline
} from 'react-icons/io5';
import FormField from '../forms/FormField';
import TextArea from '../forms/TextArea';
import CustomSelect from '../forms/CustomSelect';
import TagInput from '../forms/TagInput';
import CustomCheckbox from '../forms/CustomCheckbox';
import DragDropFileUpload from '../common/DragDropFileUpload';
import Spinner from '../common/Spinner';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import toastUtil from '../../utils/toastUtil';
import '../../assets/styles/pages/addArticle.scss';

const ArticleForm = ({
  mode = 'add', // 'add' or 'edit'
  initialData = null,
  submitHandler,
  backLink = '/articles',
  backText = 'Articles',
  pageTitle = 'Submit New Article',
  pageDescription = 'Complete the form below to submit your article for review',
  buttonText = 'Submit Article',
  loadingText = 'Submitting...'
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    abstract: initialData?.abstract || '',
    journalId: initialData?.journalId || '',
  });
  const [keywords, setKeywords] = useState(initialData?.keywords || []);
  const [keywordInput, setKeywordInput] = useState('');
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({
    menuScript: null,
    coverLetter: null,
    supplementaryFile: null
  });
  // Used in edit mode to track existing files
  const [existingFiles, setExistingFiles] = useState({
    menuScript: initialData?.menuScript || null,
    coverLetter: initialData?.coverLetter || null,
    supplementaryFile: initialData?.supplementaryFile || null
  });
  const [authors, setAuthors] = useState(
    initialData?.authors && initialData.authors.length > 0
      ? initialData.authors
      : [{
        firstName: '',
        lastName: '',
        email: '',
        affiliation: '',
        correspondingAuthor: false,
        firstAuthor: true,
        otherAuthor: false
      }]
  );

  useEffect(() => {
    fetchJournals();

    // If initialData changes (like in edit mode when data loads),
    // update our form state
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        abstract: initialData.abstract || '',
        journalId: initialData.journalId || ''
      });
      setKeywords(initialData.keywords || []);
      setAuthors(initialData.authors && initialData.authors.length > 0
        ? initialData.authors
        : [{
          firstName: '',
          lastName: '',
          email: '',
          affiliation: '',
          correspondingAuthor: false,
          firstAuthor: true,
          otherAuthor: false
        }]
      );
      if (mode === 'edit') {
        setExistingFiles({
          menuScript: initialData.menuScript || null,
          coverLetter: initialData.coverLetter || null,
          supplementaryFile: initialData.supplementaryFile || null
        });
      }
    }

    // Get journalId from URL parameters if available in add mode
    if (mode === 'add') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlJournalId = urlParams.get('journalId');

      if (urlJournalId) {
        setFormData(prev => ({
          ...prev,
          journalId: urlJournalId
        }));
      }
    }
  }, [mode, initialData]);

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
      const file = uploadedFiles[0];
      
      // File validation happens in the DragDropFileUpload component now
      setFiles(prev => ({
        ...prev,
        [name]: file
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
      document.querySelector('input[name="title"]')?.focus();
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title should be at least 10 characters';
      document.querySelector('input[name="title"]')?.focus();
    }

    // Validate abstract
    if (!formData.abstract.trim()) {
      newErrors.abstract = 'Abstract is required';
      document.querySelector('textarea[name="abstract"]')?.focus();
    } else if (formData.abstract.trim().length < 100) {
      newErrors.abstract = 'Abstract should be at least 100 characters';
      document.querySelector('textarea[name="abstract"]')?.focus();
    }

    // Validate keywords - now required and limited to maximum 6 keywords
    if (keywords.length === 0) {
      newErrors.keywords = 'Keywords are required';
      document.querySelector('input[name="keywords"]')?.focus();
    } else if (keywords.length > 6) {
      newErrors.keywords = 'Maximum 6 keywords allowed';
      document.querySelector('input[name="keywords"]')?.focus();
    }

    // Validate journal selection
    if (!formData.journalId) {
      newErrors.journalId = 'Please select a journal';
      document.querySelector('select[name="journalId"]')?.focus();
    }

    // Validate files
    // When editing, files are not required if they are already uploaded
    if (!files.menuScript && (mode === 'add' || !existingFiles.menuScript)) {
      newErrors.menuScript = 'Manuscript file is required';
      // Focus on the add manuscript button if there's an error
      document.querySelector('button[aria-label="Browse for Manuscript"]')?.focus();
    }

    if (!files.coverLetter && (mode === 'add' || !existingFiles.coverLetter)) {
      newErrors.coverLetter = 'Cover letter is required';
      // Only focus if manuscript is valid but cover letter isn't
      if (!newErrors.menuScript) {
        document.querySelector('button[aria-label="Browse for Cover Letter"]')?.focus();
      }
    }

    if (!files.supplementaryFile && (mode === 'add' || !existingFiles.supplementaryFile)) {
      newErrors.supplementaryFile = 'Supplementary file is required';
      // Only focus if manuscript and cover letter are valid but supplementary file isn't
      if (!newErrors.menuScript && !newErrors.coverLetter) {
        document.querySelector('button[aria-label="Browse for Supplementary Files"]')?.focus();
      }
    }

    // Validate authors
    authors.forEach((author, index) => {
      // First name should not be empty and should contain only letters
      if (!author.firstName?.trim()) {
        newErrors[`authors.${index}.firstName`] = 'First name is required';
        document.querySelector(`input[name="firstName-${index}"]`)?.focus();
      } else if (!/^[a-zA-Z]+$/.test(author.firstName.trim())) {
        newErrors[`authors.${index}.firstName`] = 'First name should contain only letters';
        document.querySelector(`input[name="firstName-${index}"]`)?.focus();
      }
      
      // Last name should not be empty and should contain only letters
      if (!author.lastName?.trim()) {
        newErrors[`authors.${index}.lastName`] = 'Last name is required';
        document.querySelector(`input[name="lastName-${index}"]`)?.focus();
      } else if (!/^[a-zA-Z]+$/.test(author.lastName.trim())) {
        newErrors[`authors.${index}.lastName`] = 'Last name should contain only letters';
        document.querySelector(`input[name="lastName-${index}"]`)?.focus();
      }

      if (!author.email?.trim()) {
        newErrors[`authors.${index}.email`] = 'Email is required';
        document.querySelector(`input[name="email-${index}"]`)?.focus();
      } else if (!/\S+@\S+\.\S+/.test(author.email)) {
        newErrors[`authors.${index}.email`] = 'Email is invalid';
        document.querySelector(`input[name="email-${index}"]`)?.focus();
      }

      if (!author.affiliation?.trim()) {
        newErrors[`authors.${index}.affiliation`] = 'Affiliation is required';
        document.querySelector(`input[name="affiliation-${index}"]`)?.focus();
      } else if (!/^[a-zA-Z\s]+$/.test(author.affiliation.trim())) {
        newErrors[`authors.${index}.affiliation`] = 'Affiliation should contain only letters and spaces';
        document.querySelector(`input[name="affiliation-${index}"]`)?.focus();
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

      // Add keywords as JSON string
      if (keywords.length > 0) {
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

      // Call the submit handler provided by the parent
      await submitHandler(data);
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'submitting' : 'updating'} article:`, error);
      toastUtil.error(error.response?.data?.message || `An error occurred while ${mode === 'add' ? 'submitting' : 'updating'} the article`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(backLink);
  };

  return (
    <>
      <header className="page-header">
        {mode === 'edit' && (
          <div className="back-button-container">
            <button className="back-to-home" onClick={handleGoBack}>
              <IoArrowBackOutline /> Back to {backText}
            </button>
          </div>
        )}
        <h1>{pageTitle}</h1>
        <p>{pageDescription}</p>
      </header>

      <div className="content-container">
        <div className="add-article-form-container">
          <form onSubmit={handleSubmit} className="add-article-form">
            <div className="form-section">
              <h2 className="section-title">
                <IoNewspaperOutline className="section-icon" />
                Article Information
              </h2>

              {loadingJournals ? (
                <div className="form-field">
                  <label className="form-field__label">
                    <span className="form-field__label-text">
                      Select Journal
                      <span className="form-field__required">*</span>
                    </span>
                  </label>
                  <div className="select-loading">
                    <Spinner size="small" />
                    <span>Loading journals...</span>
                  </div>
                </div>
              ) : (
                <CustomSelect
                  label="Select Journal"
                  name="journalId"
                  value={formData.journalId}
                  onChange={handleInputChange}
                  options={journals.map(journal => ({
                    value: journal._id,
                    label: journal.title
                  }))}
                  placeholder="Select a journal"
                  error={errors.journalId}
                  required
                  icon={<IoNewspaperOutline />}
                />
              )}              <FormField
                label="Article Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the complete title of your article"
                error={errors.title}
                // required
                icon={<IoTextOutline />}
              />

              <TextArea
                label="Abstract"
                name="abstract"
                value={formData.abstract}
                onChange={handleInputChange}
                placeholder="Provide a concise summary of your article"
                rows={6}
                error={errors.abstract}
                // required
                icon={<IoBookOutline />}
              />

              <TagInput
                label="Keywords"
                tags={keywords}
                setTags={setKeywords}
                tagInputValue={keywordInput}
                setTagInputValue={setKeywordInput}
                placeholder="Type and press Enter to add keywords..."
                error={errors.keywords}
                // required
                maxTags={6}
                helpText="Add up to 6 keywords. Press Enter or tab after each keyword."
                icon={<IoPricetagOutline />}
              />
            </div>            <div className="form-section">
              <h2 className="section-title">
                <IoCloudUploadOutline className="section-icon" />
                Upload Files
              </h2><div className="file-uploads-row">
                <DragDropFileUpload
                  title="Manuscript"
                  name="menuScript"
                  acceptedFormats=".pdf"
                  value={files.menuScript}
                  onChange={handleFileChange}
                  error={errors.menuScript}
                  required={mode === 'add' || !existingFiles.menuScript}
                  existingFile={mode === 'edit' ? existingFiles.menuScript : null}
                  maxFileSize={10}
                />

                <DragDropFileUpload
                  title="Cover Letter"
                  name="coverLetter"
                  acceptedFormats=".pdf"
                  value={files.coverLetter}
                  onChange={handleFileChange}
                  error={errors.coverLetter}
                  required={mode === 'add' || !existingFiles.coverLetter}
                  existingFile={mode === 'edit' ? existingFiles.coverLetter : null}
                  maxFileSize={10}
                />

                <DragDropFileUpload
                  title="Supplementary Files"
                  name="supplementaryFile"
                  acceptedFormats=".pdf,.doc,.docx,.xls,.xlsx"
                  value={files.supplementaryFile}
                  onChange={handleFileChange}
                  error={errors.supplementaryFile}
                  required={false}
                  existingFile={mode === 'edit' ? existingFiles.supplementaryFile : null}
                  maxFileSize={10}
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
                  </div>                  <div className="author-form-row">
                    <FormField
                      label="First Name"
                      name={`firstName-${index}`}
                      value={author.firstName || ''}
                      onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                      placeholder="First Name"
                      error={errors[`authors.${index}.firstName`]}
                      // required
                      icon={<IoPersonOutline />}
                    />

                    <FormField
                      label="Last Name"
                      name={`lastName-${index}`}
                      value={author.lastName || ''}
                      onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                      placeholder="Last Name"
                      error={errors[`authors.${index}.lastName`]}
                      // required
                      icon={<IoPersonOutline />}
                    />
                  </div>

                  <div className="author-form-row">
                    <FormField
                      label="Email"
                      name={`email-${index}`}
                      type="email"
                      value={author.email || ''}
                      onChange={(e) => handleAuthorChange(index, 'email', e.target.value)}
                      placeholder="Email Address"
                      error={errors[`authors.${index}.email`]}
                      // required
                      icon={<IoMailOutline />}
                    />

                    <FormField
                      label="Affiliation"
                      name={`affiliation-${index}`}
                      value={author.affiliation || ''}
                      onChange={(e) => handleAuthorChange(index, 'affiliation', e.target.value)}
                      placeholder="University or Institution"
                      error={errors[`authors.${index}.affiliation`]}
                      // required
                      icon={<IoSchoolOutline />}
                    />
                  </div>
                  <div className="author-checkboxes">
                    <div className="checkbox-item">
                      <CustomCheckbox
                        id={`firstAuthor-${index}`}
                        checked={!!author.firstAuthor}
                        onChange={() => handleCheckboxChange(index, 'firstAuthor')}
                        label="First Author"
                      />
                    </div>

                    <div className="checkbox-item">
                      <CustomCheckbox
                        id={`correspondingAuthor-${index}`}
                        checked={!!author.correspondingAuthor}
                        onChange={() => handleCheckboxChange(index, 'correspondingAuthor')}
                        label="Corresponding Author"
                      />
                    </div>

                    <div className="checkbox-item">
                      <CustomCheckbox
                        id={`otherAuthor-${index}`}
                        checked={!!author.otherAuthor}
                        onChange={() => handleCheckboxChange(index, 'otherAuthor')}
                        label="Other Author"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handleGoBack}
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
                    {loadingText}
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircleOutline />
                    {buttonText}
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

export default ArticleForm;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  IoArrowBackOutline,
  IoSaveOutline,
  IoNewspaperOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoCheckmarkCircleOutline,
  IoPerson,
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/forms/FormField';
import TextArea from '../components/forms/TextArea';
import DateField from '../components/forms/DateField';
import CustomSelect from '../components/forms/CustomSelect';
import TagInput from '../components/forms/TagInput';
import Spinner from '../components/common/Spinner';
import journalService from '../services/journalService';
import '../assets/styles/pages/addJournal.scss';

const EditJournalPage = () => {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const tagInputRef = useRef(null);
  const [journal, setJournal] = useState(null);
  const [sourceRoute, setSourceRoute] = useState('/');
  const [editorInfo, setEditorInfo] = useState(null);

  // Initialize form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    publishedDate: '',
    publicationFrequency: '',
    openAccess: false,
    peerReviewProcess: '',
    impactFactor: {
      value: 0,
      year: new Date().getFullYear()
    },
    metrics: {
      averageReviewTime: '',
      acceptanceRate: '',
      timeToPublication: '',
      articlesPerYear: 0
    },
    submissionGuidelines: '',
    editorId: ''
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Check if user is an admin or editor
  const isAdminOrEditor = user && (user.role === "admin" || user.role === "editor");

  // Track referrer URL to determine where to go back
  useEffect(() => {
    // Get the referrer from location state, session storage, or default to home
    const referrer = location.state?.from || '/';
    setSourceRoute(referrer);
  }, [location]);

  // Fetch journal data and redirect non-admin/editor users
  useEffect(() => {
    if (!isAdminOrEditor) {
      navigate('/');
      toast.error('You do not have permission to access this page');
      return;
    }

    const fetchJournal = async () => {
      setLoading(true);
      try {
        const response = await journalService.getJournalById(journalId);
        if (response.success && response.data) {
          const journalData = response.data;
          setJournal(journalData);
          
          // Convert submission guidelines array to string for textarea
          const submissionGuidelinesStr = journalData.submissionGuidelines && 
            Array.isArray(journalData.submissionGuidelines) ? 
            journalData.submissionGuidelines.join('\n') : '';

          // Set form data from journal
          setFormData({
            title: journalData.title || '',
            description: journalData.description || '',
            category: journalData.category || '',
            publishedDate: new Date(journalData.publishedDate || journalData.createdAt).toISOString().split('T')[0],
            publicationFrequency: journalData.publicationFrequency || 'Monthly',
            openAccess: !!journalData.openAccess,
            peerReviewProcess: journalData.peerReviewProcess || 'Single-blind peer review',
            impactFactor: {
              value: journalData.impactFactor?.value || 0,
              year: journalData.impactFactor?.year || new Date().getFullYear()
            },
            metrics: {
              averageReviewTime: journalData.metrics?.averageReviewTime || '30 days',
              acceptanceRate: journalData.metrics?.acceptanceRate || '50%',
              timeToPublication: journalData.metrics?.timeToPublication || '60 days',
              articlesPerYear: journalData.metrics?.articlesPerYear || 100
            },
            submissionGuidelines: submissionGuidelinesStr,
            editorId: journalData.editorId || ''
          });

          // Set tags
          setTags(journalData.tags || []);
        } else {
          toast.error('Failed to load journal data');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching journal:', error);
        toast.error('An error occurred while loading the journal data');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchJournal();
  }, [journalId, isAdminOrEditor, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'impactFactor.value' || name === 'impactFactor.year') {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    } else if (name === 'metrics.averageReviewTime' ||
      name === 'metrics.acceptanceRate' ||
      name === 'metrics.timeToPublication' ||
      name === 'metrics.articlesPerYear') {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: child === 'articlesPerYear' ? (parseInt(value) || 0) : value
        }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Tag handling functions
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      // Remove the last tag when backspace is pressed on empty input
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmedInput = tagInput.trim();
    if (trimmedInput && !tags.includes(trimmedInput)) {
      const newTags = [...tags, trimmedInput];
      setTags(newTags);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleTagInputBlur = () => {
    if (tagInput.trim()) {
      addTag();
    }
  };

  const focusTagInput = () => {
    tagInputRef.current?.focus();
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Journal title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.publicationFrequency) {
      newErrors.publicationFrequency = 'Publication frequency is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Include tags from the state
      const processedData = {
        ...formData,
        tags: tags,
        submissionGuidelines: formData.submissionGuidelines
          ? formData.submissionGuidelines.split('\n').filter(line => line.trim())
          : []
      };

      const response = await journalService.updateJournal(journalId, processedData);

      if (response.success) {
        toast.success('Journal updated successfully');
        // If we came from the journal details page, go back there
        if (sourceRoute.includes(`/view-journal/${journalId}`)) {
          navigate(`/view-journal/${journalId}`);
        } else {
          // Otherwise return to where we came from (likely home page)
          navigate(sourceRoute);
        }
      } else {
        toast.error(response.message || 'Failed to update journal');
      }
    } catch (error) {
      console.error('Error updating journal:', error);
      toast.error(error.message || 'An error occurred while updating the journal');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdminOrEditor) {
    return null; // Don't render anything if not admin/editor
  }

  return (
    <div className="add-journal-page">
      <div className="page-header">
        <h1>Edit Journal</h1>
        <p>Update journal information and settings</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner size="medium" />
          <p>Loading journal data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="journal-form">
            <div className="form-section">
              <h2 className="section-title">
                <IoNewspaperOutline className="section-icon" />
                Basic Journal Information
              </h2>

              <FormField
                label="Journal Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter the title of the journal"
                error={errors.title}
                required
              />

              <TextArea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of the journal"
                rows={5}
                error={errors.description}
                required
              />

              <div className="form-row">
                <FormField
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="E.g., Science, Medicine, Psychology"
                  error={errors.category}
                  required
                />

                <DateField
                  label="Published Date"
                  name="publishedDate"
                  value={formData.publishedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <TagInput
                label="Tags"
                tags={tags}
                setTags={setTags}
                tagInputValue={tagInput}
                setTagInputValue={setTagInput}
                placeholder="Add tags (press Enter or comma)"
                helpText="Press Enter, comma, or tab to add a tag"
              />
            </div>

            <div className="form-section">
              <h2 className="section-title">
                <IoCalendarOutline className="section-icon" />
                Publication Details
              </h2>

              <div className="form-row">
                <CustomSelect
                  label="Publication Frequency"
                  name="publicationFrequency"
                  value={formData.publicationFrequency}
                  onChange={handleInputChange}
                  options={[
                    { value: "Daily", label: "Daily" },
                    { value: "Weekly", label: "Weekly" },
                    { value: "Monthly", label: "Monthly" },
                    { value: "Quarterly", label: "Quarterly" },
                    { value: "Annually", label: "Annually" }
                  ]}
                  placeholder="Select publication frequency"
                  error={errors.publicationFrequency}
                  required
                  icon={<IoCalendarOutline />}
                />

                <FormField
                  label="Peer Review Process"
                  name="peerReviewProcess"
                  value={formData.peerReviewProcess}
                  onChange={handleInputChange}
                  placeholder="E.g., Single-blind peer review"
                />
              </div>

              <div className="form-field checkbox-field">
                <input
                  type="checkbox"
                  id="openAccess"
                  name="openAccess"
                  checked={formData.openAccess}
                  onChange={handleInputChange}
                  className="form-field__checkbox"
                />
                <label htmlFor="openAccess" className="form-field__checkbox-label">
                  Open Access Journal
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">
                <IoStatsChartOutline className="section-icon" />
                Journal Impact & Metrics
              </h2>

              <div className="form-row">
                <FormField
                  label="Impact Factor Value"
                  name="impactFactor.value"
                  type="number"
                  min="0"
                  step="0.001"
                  value={formData.impactFactor.value}
                  onChange={handleInputChange}
                  placeholder="E.g., 4.325"
                />

                <FormField
                  label="Impact Factor Year"
                  name="impactFactor.year"
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.impactFactor.year}
                  onChange={handleInputChange}
                  placeholder="E.g., 2025"
                />
              </div>

              <div className="metrics-grid">
                <FormField
                  label="Average Review Time"
                  name="metrics.averageReviewTime"
                  value={formData.metrics.averageReviewTime}
                  onChange={handleInputChange}
                  placeholder="E.g., 30 days"
                />

                <FormField
                  label="Acceptance Rate"
                  name="metrics.acceptanceRate"
                  value={formData.metrics.acceptanceRate}
                  onChange={handleInputChange}
                  placeholder="E.g., 50%"
                />

                <FormField
                  label="Time to Publication"
                  name="metrics.timeToPublication"
                  value={formData.metrics.timeToPublication}
                  onChange={handleInputChange}
                  placeholder="E.g., 60 days"
                />

                <FormField
                  label="Articles Per Year"
                  name="metrics.articlesPerYear"
                  type="number"
                  min="0"
                  value={formData.metrics.articlesPerYear}
                  onChange={handleInputChange}
                  placeholder="E.g., 100"
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">
                <IoCheckmarkCircleOutline className="section-icon" />
                Submission Guidelines
              </h2>

              <TextArea
                label="Submission Guidelines"
                name="submissionGuidelines"
                value={formData.submissionGuidelines}
                onChange={handleInputChange}
                placeholder="Enter submission guidelines, one per line"
                rows={8}
                description="Enter each guideline on a new line. These will be presented as a list to authors."
              />
            </div>

            {isAdminOrEditor && (
              <div className="form-section">
                <h2 className="section-title">
                  <IoPerson className="section-icon" />
                  Editor Information
                </h2>

                <FormField
                  label="Editor ID"
                  name="editorId"
                  value={formData.editorId}
                  onChange={handleInputChange}
                  placeholder="Enter the editor ID"
                />
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => navigate(sourceRoute)}
                disabled={submitting}
              >
                <IoArrowBackOutline /> Back
              </button>
              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner size="small" /> Saving...
                  </>
                ) : (
                  <>
                    <IoSaveOutline /> Update Journal
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditJournalPage;
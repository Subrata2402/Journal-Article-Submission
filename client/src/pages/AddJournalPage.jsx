import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoArrowBackOutline,
  IoSaveOutline,
  IoNewspaperOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoCheckmarkCircleOutline,
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/forms/FormField';
import TextArea from '../components/forms/TextArea';
import DateField from '../components/forms/DateField';
import CustomSelect from '../components/forms/CustomSelect';
import TagInput from '../components/forms/TagInput';
import Spinner from '../components/common/Spinner';
import httpService from '../services/httpService';
import { API_ENDPOINTS } from '../config/api';
import '../assets/styles/pages/addJournal.scss';

const AddJournalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize form state based on journal schema
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    publishedDate: new Date().toISOString().split('T')[0],
    publicationFrequency: 'Monthly',
    openAccess: false,
    peerReviewProcess: 'Single-blind peer review',
    impactFactor: {
      value: 0,
      year: new Date().getFullYear()
    },
    metrics: {
      averageReviewTime: '30 days',
      acceptanceRate: '50%',
      timeToPublication: '60 days',
      articlesPerYear: 100
    },
    submissionGuidelines: [
      'Manuscripts must be original and not published elsewhere',
      'Research must follow ethical standards appropriate to the field',
      'Formatting should follow journal-specific requirements',
      'Citations should use appropriate referencing style',
      'All data should be accessible and transparent'
    ].join('\n')
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Check if user is an admin
  const isAdmin = user && user.role === "admin";

  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Only administrators can access this page');
    }
  }, [isAdmin, navigate]);

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

    setLoading(true);

    try {
      // Include tags from the state
      const processedData = {
        ...formData,
        tags: tags,
        submissionGuidelines: formData.submissionGuidelines
          ? formData.submissionGuidelines.split('\n').filter(line => line.trim())
          : []
      };

      const response = await httpService.post(API_ENDPOINTS.JOURNALS.ADD, processedData);

      if (response.data.success) {
        toast.success('Journal added successfully');
        navigate('/');
      } else {
        toast.error(response.data.message || 'Failed to add journal');
      }
    } catch (error) {
      console.error('Error adding journal:', error);
      toast.error(error.message || 'An error occurred while adding the journal');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="add-journal-page">
      <div className="page-header">
        <h1>Add New Journal</h1>
        <p>Create a new journal for authors to submit articles to</p>
      </div>

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

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/')}
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
                  <Spinner size="small" /> Submitting...
                </>
              ) : (
                <>
                  <IoSaveOutline /> Save Journal
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddJournalPage;
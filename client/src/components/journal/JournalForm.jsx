import {
  IoNewspaperOutline,
  IoCalendarOutline,
  IoStatsChartOutline,
  IoCheckmarkCircleOutline,
  IoSaveOutline,
  IoArrowBackOutline
} from 'react-icons/io5';
import FormField from '../forms/FormField';
import TextArea from '../forms/TextArea';
import DateField from '../forms/DateField';
import CustomSelect from '../forms/CustomSelect';
import CustomCheckbox from '../forms/CustomCheckbox';
import TagInput from '../forms/TagInput';
import Spinner from '../common/Spinner';

const JournalForm = ({
  formData,
  setFormData,
  tags,
  setTags,
  tagInput,
  setTagInput,
  errors,
  setErrors,
  isSubmitting,
  handleSubmit,
  handleCancel,
  submitButtonText = 'Save Journal',
  isEdit = false
}) => {
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

  const handleCheckboxChange = (checked, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));

    // Clear error when checkbox is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
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
            <CustomCheckbox
              id="openAccess"
              name="openAccess"
              checked={formData.openAccess}
              onChange={(checked) => handleCheckboxChange(checked, 'openAccess')}
              label="Open Access Journal"
            />
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
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            {isEdit ? (
              <>
                <IoArrowBackOutline /> Back
              </>
            ) : (
              'Cancel'
            )}
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner size="small" /> {isEdit ? 'Saving...' : 'Submitting...'}
              </>
            ) : (
              <>
                <IoSaveOutline /> {submitButtonText}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default JournalForm;

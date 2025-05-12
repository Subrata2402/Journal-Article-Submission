/**
 * Utility functions for journal form handling
 */

/**
 * Get the default journal form data for new journals
 * @returns {Object} Default journal form data
 */
export const getDefaultJournalFormData = () => ({
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

/**
 * Validates the journal form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} An object with error messages keyed by field name
 */
export const validateJournalForm = (formData) => {
  const errors = {};

  // Required fields validation
  if (!formData.title.trim()) {
    errors.title = 'Journal title is required';
  }

  if (!formData.description.trim()) {
    errors.description = 'Description is required';
  }

  if (!formData.category.trim()) {
    errors.category = 'Category is required';
  }

  if (!formData.publicationFrequency) {
    errors.publicationFrequency = 'Publication frequency is required';
  }

  return errors;
};

/**
 * Processes form data for API submission
 * @param {Object} formData - The form data to process
 * @param {Array} tags - Journal tags
 * @returns {Object} Processed data ready for API submission
 */
export const processJournalFormData = (formData, tags) => {
  return {
    ...formData,
    tags: tags,
    submissionGuidelines: formData.submissionGuidelines
      ? formData.submissionGuidelines.split('\n').filter(line => line.trim())
      : []
  };
};

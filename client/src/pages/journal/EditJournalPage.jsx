import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import JournalForm from '../../components/journal/JournalForm';
import Spinner from '../../components/common/Spinner';
import journalService from '../../services/journalService';
import { 
  validateJournalForm,
  processJournalFormData 
} from '../../utils/journalFormUtils';
import '../../assets/styles/pages/addJournal.scss';

const EditJournalPage = () => {
  const navigate = useNavigate();
  const { journalId } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [journal, setJournal] = useState(null);
  const [sourceRoute, setSourceRoute] = useState('/');

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
    submissionGuidelines: ''
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
            submissionGuidelines: submissionGuidelinesStr
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
  // All the form handling logic has been moved to the JournalForm component
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the utility function for validation
    const newErrors = validateJournalForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      // Process the form data using the utility function
      const processedData = processJournalFormData(formData, tags);

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

  const handleCancel = () => {
    navigate(sourceRoute);
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
        <JournalForm
          formData={formData}
          setFormData={setFormData}
          tags={tags}
          setTags={setTags}
          tagInput={tagInput}
          setTagInput={setTagInput}
          errors={errors}
          setErrors={setErrors}
          isSubmitting={submitting}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          submitButtonText="Update Journal"
          isEdit={true}
        />
      )}
    </div>
  );
};

export default EditJournalPage;
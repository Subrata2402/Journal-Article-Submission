import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import JournalForm from '../../components/journal/JournalForm';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import { 
  getDefaultJournalFormData, 
  validateJournalForm,
  processJournalFormData
} from '../../utils/journalFormUtils';
import '../../assets/styles/pages/addJournal.scss';

const AddJournalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize form state based on journal schema
  const [formData, setFormData] = useState(getDefaultJournalFormData());
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Check if user is an admin
  const isAdmin = user && user.role === "admin";

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Only administrators can access this page');
    }
  }, [isAdmin, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the utility function for validation
    const newErrors = validateJournalForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Process the form data using the utility function
      const processedData = processJournalFormData(formData, tags);

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

  const handleCancel = () => {
    navigate('/');
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

      <JournalForm
        formData={formData}
        setFormData={setFormData}
        tags={tags}
        setTags={setTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        errors={errors}
        setErrors={setErrors}
        isSubmitting={loading}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        submitButtonText="Save Journal"
        isEdit={false}
      />
    </div>
  );
};

export default AddJournalPage;
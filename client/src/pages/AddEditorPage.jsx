import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoSchoolOutline,
  IoSaveOutline,
  IoArrowBackOutline,
  IoNewspaperOutline,
} from 'react-icons/io5';
import FormField from '../components/forms/FormField';
import CustomSelect from '../components/forms/CustomSelect';
import Spinner from '../components/common/Spinner';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import httpService from '../services/httpService';
import { API_ENDPOINTS } from '../config/api';
import '../assets/styles/pages/addJournal.scss';
import '../assets/styles/pages/reviewer.scss';

const AddEditorPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [journals, setJournals] = useState([]);
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    institution: '',
    journalId: ''
  });
  const [errors, setErrors] = useState({});

  // Check if user is an admin
  const isAdmin = user && user.role === "admin";

  // Redirect non-admin users
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('Only administrators can access this page');
    }
    
    // Fetch journals for the dropdown
    fetchJournals();
  }, [isAdmin, navigate]);

  const fetchJournals = async () => {
    setLoadingJournals(true);
    try {
      const response = await httpService.get(API_ENDPOINTS.JOURNALS.LIST);
      if (response.data.success) {
        setJournals(response.data.data.journals);
      } else {
        toast.error('Failed to fetch journals');
      }
    } catch (error) {
      console.error('Error fetching journals:', error);
      toast.error('Error fetching journals. Please try again.');
    } finally {
      setLoadingJournals(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNumber = 'Phone number should be 10 digits';
    }
    
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }
    
    if (!formData.journalId) {
      newErrors.journalId = 'Please select a journal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await httpService.post(
        API_ENDPOINTS.JOURNALS.ADD_EDITOR,
        formData
      );
      
      if (response.data.success) {
        toast.success('Editor added successfully');
        // Reset form
        setFormData({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          institution: '',
          journalId: ''
        });
      } else {
        toast.error(response.data.message || 'Failed to add editor');
      }
    } catch (error) {
      console.error('Error adding editor:', error);
      toast.error(error.response?.data?.message || 'An error occurred while adding the editor');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="add-journal-page">
      <div className="page-header">
        <h1>Add Journal Editor</h1>
        <p>Assign an editor to a specific journal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="journal-form">
          <div className="form-section">
            <h2 className="section-title">
              <IoPersonOutline className="section-icon" />
              Editor Information
            </h2>
            
            <div className="form-row">
              <FormField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                error={errors.firstName}
                required
              />
              
              <FormField
                label="Middle Name (Optional)"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Enter middle name"
                error={errors.middleName}
              />
            </div>

            <div className="form-row">
              <FormField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                error={errors.lastName}
                required
              />
              
              <FormField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                error={errors.email}
                required
              />
            </div>

            <div className="form-row">
              <FormField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                error={errors.phoneNumber}
                required
              />
              
              <FormField
                label="Institution"
                name="institution"
                value={formData.institution}
                onChange={handleChange}
                placeholder="Enter institution or organization"
                error={errors.institution}
                required
              />
            </div>

            <div className="form-row">
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
                  onChange={handleChange}
                  options={journals.map(journal => ({
                    value: journal._id,
                    label: journal.title
                  }))}
                  placeholder="Select a journal"
                  required
                  error={errors.journalId}
                  icon={<IoNewspaperOutline />}
                />
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="secondary-button"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              <IoArrowBackOutline /> Cancel
            </button>
            
            <button 
              type="submit" 
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="small" /> Adding Editor...
                </>
              ) : (
                <>
                  <IoSaveOutline /> Add Editor
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditorPage;
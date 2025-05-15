import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoCalendarOutline,
  IoSchoolOutline,
  IoAtOutline,
  IoArrowBackOutline,
  IoSaveOutline,
  IoCloudUploadOutline,
  IoLockClosedOutline,
} from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import { PROFILE_PICTURES_PATH, DEFAULT_PROFILE_IMAGE } from '../../config/constants';
import FormField from '../../components/forms/FormField';
import DateField from '../../components/forms/DateField';
import Spinner from '../../components/common/Spinner';
import LazyImage from '../../components/common/LazyImage';
import toastUtil from '../../utils/toastUtil';
import '../../assets/styles/pages/profile.scss';

const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    userName: '',
    phoneNumber: '',
    dateOfBirth: '',
    institution: '',
    profilePicture: null, // Added to store profile picture file
    email: '', // Added email field
  });
  const [emailVerified, setEmailVerified] = useState(false); // Added to store email verification status
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = React.useRef(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      const response = await httpService.get(API_ENDPOINTS.AUTH.PROFILE_DETAILS);

      if (response.data.success) {
        const profile = response.data.data;
        // Populate form data with current profile information, ensuring phoneNumber is a string
        setFormData({
          firstName: profile.firstName || '',
          middleName: profile.middleName || '',
          lastName: profile.lastName || '',
          userName: profile.userName || '',
          phoneNumber: profile.phoneNumber ? String(profile.phoneNumber) : '',
          dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
          institution: profile.institution || '',
          profilePicture: profile.profilePicture || null, // Store profile picture filename
          email: profile.email?.id || '', // Store email from profile
        });

        // Set email verification status
        setEmailVerified(profile.email?.verified || false);
      } else {
        toastUtil.error('Failed to load profile details');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
      
      if (error.response?.status === 401) {
        logout();
        navigate('/login', { state: { form: location.state?.from } });
        toastUtil.error('Your session has expired. Please login again.');
      } else {
        toastUtil.error('An error occurred while fetching profile details');
        navigate('/profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: 'Please select an image file',
        }));
        return;
      }

      // Validate file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: 'Image must be less than 2MB',
        }));
        return;
      }

      setProfilePicture(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      if (errors.profilePicture) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: '',
        }));
      }
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

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    }

    // Fixed phoneNumber validation to safely handle any type
    const phoneNumberStr = String(formData.phoneNumber || '');
    if (!phoneNumberStr.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phoneNumberStr.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNumber = 'Phone number should be 10 digits';
    }

    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Create FormData object to handle file upload
      const data = new FormData();
      
      // Append text fields
      data.append('firstName', formData.firstName);
      data.append('middleName', formData.middleName);
      data.append('lastName', formData.lastName);
      data.append('userName', formData.userName);
      data.append('phoneNumber', formData.phoneNumber);
      data.append('dateOfBirth', formData.dateOfBirth);
      data.append('institution', formData.institution);
      
      // Append profile picture if selected
      if (profilePicture) {
        data.append('profile-picture', profilePicture);
      }

      const response = await httpService.post(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toastUtil.success('Profile updated successfully');
        navigate('/profile');
      } else {
        toastUtil.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toastUtil.error(error.response?.data?.message || 'An error occurred while updating your profile');
    } finally {
      setSubmitting(false);
    }
  };
  // Function to build the profile picture URL
  const getProfilePictureUrl = (filename) => {
    if (!filename) return DEFAULT_PROFILE_IMAGE;
    
    // If the default image is not a URL but a local file, ensure we use the correct path
    if (filename === DEFAULT_PROFILE_IMAGE) {
      return filename;
    }
    
    return `${PROFILE_PICTURES_PATH}/${filename}`;
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-container">
            <Spinner />
            <p>Loading profile data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Link to="/profile" className="back-to-home">
          <IoArrowBackOutline /> Back to Profile
        </Link>

        <div className="profile-header">
          <h1>Edit Profile</h1>
        </div>

        <div className="edit-profile-content">
          <div className="profile-card">
            <form onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <div className="profile-picture-section">                <div 
                  className="profile-picture-upload"
                  onClick={handleProfilePictureClick}
                >
                  <div className="image-wrapper">
                    {previewUrl ? (
                      <img 
                        src={previewUrl}
                        alt="Profile Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <LazyImage
                        src={getProfilePictureUrl(formData?.profilePicture)}
                        alt="Profile Preview"
                        height="100%"
                        width="100%"
                        objectFit="cover"
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                  <div className="upload-overlay">
                    <IoCloudUploadOutline className="upload-icon" />
                    <span>Change Photo</span>
                  </div>
                </div>

                <input 
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                
                {errors.profilePicture && (
                  <div className="error-message">{errors.profilePicture}</div>
                )}
                
                <p className="picture-hint">Click to upload a new profile picture (max 2MB)</p>
              </div>

              {/* Personal Information */}
              <div className="form-section">
                <h3 className="section-title">Personal Information</h3>
                
                <div className="form-row">
                  <FormField
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    error={errors.firstName}
                    required
                    icon={<IoPersonOutline />}
                  />
                  
                  <FormField
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    error={errors.lastName}
                    required
                    icon={<IoPersonOutline />}
                  />
                </div>

                <div className="form-row">
                  <FormField
                    label="Username"
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder="Enter username"
                    error={errors.userName}
                    required
                    icon={<IoAtOutline />}
                  />
                  
                  <FormField
                    label="Middle Name (Optional)"
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Enter middle name"
                    error={errors.middleName}
                    icon={<IoPersonOutline />}
                  />
                </div>

                <div className="form-row">
                  {/* Added disabled email field */}
                  <FormField
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Your email address"
                    icon={<IoMailOutline />}
                    disabled={true}
                    helperText={emailVerified ? "Email verified" : "Email not verified"}
                    helperTextClassName={emailVerified ? "helper-text-success" : "helper-text-warning"}
                    rightIcon={<IoLockClosedOutline className="locked-icon" />}
                  />
                  
                  <FormField
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    error={errors.phoneNumber}
                    required
                    icon={<IoCallOutline />}
                  />
                </div>

                <div className="form-row">
                  <FormField
                    label="Institution"
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="Enter your institution"
                    error={errors.institution}
                    required
                    icon={<IoSchoolOutline />}
                  />
                  
                  <DateField
                    label="Date of Birth (Optional)"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    error={errors.dateOfBirth}
                    placeholder="Select your date of birth"
                    maxDate={new Date().toISOString().split('T')[0]} // Today's date as max
                    icon={<IoCalendarOutline />}
                  />
                </div>
              </div>

              {/* Removed the Email Note section since we now have the email field */}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => navigate('/profile')}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner"></span>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <IoSaveOutline />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
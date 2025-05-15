import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiEdit, FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiSettings } from 'react-icons/fi';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import { PROFILE_PICTURES_PATH, DEFAULT_PROFILE_IMAGE } from '../../config/constants';
import Spinner from '../../components/common/Spinner';
import LazyImage from '../../components/common/LazyImage';
import toastUtil from '../../utils/toastUtil';
import '../../assets/styles/pages/profile.scss';
import { FaCircleCheck } from 'react-icons/fa6';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous error state
      const response = await httpService.get(API_ENDPOINTS.AUTH.PROFILE_DETAILS);

      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        setError('Failed to load profile details');
        toastUtil.error(response.data.message || 'Failed to load profile details');
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);

      if (error.response?.status === 401) {
        logout();
        navigate('/login', { state: { from: location.state?.from } });
        toastUtil.error('Your session has expired. Please login again.');
      } else {
        setError('An error occurred while fetching profile details');
        toastUtil.error(error.response?.data?.message || 'An error occurred while fetching profile details');
      }
    } finally {
      setLoading(false);
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

  const formatDate = (dateString, short = false, includeTime = false) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: short ? 'numeric' : 'long',
      day: 'numeric',
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <Link to="/" className="back-to-home">
          <IoArrowBackOutline /> Back to Home
        </Link>
        {loading ? (
          <div className="loading-container">
            <Spinner />
            <p>Loading profile...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <h2>Error Loading Profile</h2>
            <p>{error}</p>
            <button onClick={fetchProfileDetails}>Try Again</button>
          </div>
        ) : (
          <>
            <div className="profile-header">
              <h1>My Profile</h1>
              <button className="edit-profile-btn" onClick={() => navigate('/edit-profile')}>
                <FiEdit /> Edit Profile
              </button>
            </div>

            <div className="profile-content">
              <div className="profile-card profile-card-main">
                <div className="profile-cover-image"></div>
                <div className="profile-avatar">
                  <LazyImage
                    src={getProfilePictureUrl(profileData?.profilePicture)}
                    alt={`${profileData?.firstName}'s profile`}
                    objectFit="cover"
                    crossOrigin="anonymous"
                  />
                  {profileData?.email?.verified && (
                    <span className="verified-badge" title="Email Verified"><FaCircleCheck color='var(--success-color)' size={22} /></span>
                  )}
                </div>

                <div className="profile-intro">
                  <h2>
                    {profileData?.firstName} {profileData?.middleName} {profileData?.lastName}
                  </h2>
                  <p className="username">@{profileData?.userName}</p>
                  <p className="user-role">{profileData?.role || 'User'}</p>

                  <div className="profile-stats">
                    <div className="stat">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Articles</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{formatDate(profileData?.createdAt, true)}</span>
                      <span className="stat-label">Member Since</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">0</span>
                      <span className="stat-label">Reviews</span>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button className="action-btn">
                      <FiSettings /> Account Settings
                    </button>
                  </div>
                </div>
              </div>

              <div className="profile-sections">
                <div className="profile-card profile-card-details">
                  <h3 className="section-title">Personal Information</h3>

                  <div className="info-grid">
                    <div className="info-item">
                      <FiMail className="info-icon" />
                      <div>
                        <label>Email</label>
                        <p>{profileData?.email?.id || 'N/A'}</p>
                        {profileData?.email?.verified && (
                          <span className="verified-tag">Verified</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <FiPhone className="info-icon" />
                      <div>
                        <label>Phone Number</label>
                        <p>{profileData?.phoneNumber || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FiMapPin className="info-icon" />
                      <div>
                        <label>Institution</label>
                        <p>{profileData?.institution || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="info-item">
                      <FiCalendar className="info-icon" />
                      <div>
                        <label>Date of Birth</label>
                        <p>{formatDate(profileData?.dateOfBirth)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-card account-info">
                  <h3 className="section-title">Account Information</h3>
                  <div className="info-timeline">
                    <div className="timeline-item">
                      <div className="timeline-icon">
                        <FiUser />
                      </div>
                      <div className="timeline-content">
                        <h4>Account Created</h4>
                        <p>{formatDate(profileData?.createdAt, false, true)}</p>
                      </div>
                    </div>
                    <div className="timeline-item">
                      <div className="timeline-icon">
                        <FiEdit />
                      </div>
                      <div className="timeline-content">
                        <h4>Last Updated</h4>
                        <p>{formatDate(profileData?.updatedAt, false, true)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
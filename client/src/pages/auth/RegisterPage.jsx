import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  IoPersonAddOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoCalendarOutline,
  IoLockClosedOutline,
  IoSchoolOutline,
  IoAtOutline,
  IoPersonCircleOutline,
  IoArrowBackOutline,
  IoRefreshOutline
} from 'react-icons/io5';
import FormField from '../../components/forms/FormField';
import DateField from '../../components/forms/DateField';
import Alert from '../../components/common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import toastUtil from '../../utils/toastUtil';
import { secureSessionStorage } from '../../utils/storageUtil';
import '../../assets/styles/pages/auth.scss';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confPassword: '',
    institution: '',
    dateOfBirth: '',
  });
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Function to generate a username based on first name
  const generateUsername = () => {
    if (!formData.firstName) {
      setErrors(prev => ({
        ...prev,
        userName: 'Please enter your first name first'
      }));
      return;
    }
    
    // Clear any existing username error
    if (errors.userName) {
      setErrors(prev => ({
        ...prev,
        userName: ''
      }));
    }
    
    // Generate a random 3-digit number
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    
    // Create username: firstname + 3 random digits
    const generatedUsername = `${formData.firstName.toLowerCase()}${randomNum}`;
    
    // Update the form data with the new username
    setFormData(prev => ({
      ...prev,
      userName: generatedUsername
    }));
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

  const validateForm = () => {
    const newErrors = {};

    // First name should not be empty and should contain only letters
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      newErrors.firstName = 'First name must contain only letters';
    }

    // Middle name can be empty or contain only letters
    if (formData.middleName && !/^[A-Za-z]*$/.test(formData.middleName)) {
      newErrors.middleName = 'Middle name must contain only letters';
    }
    
    // Last name should not be empty and should contain only letters
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Last name must contain only letters';
    }

    // User name should not be empty and should contain only alphanumeric characters and underscores
    if (!formData.userName) {
      newErrors.userName = 'Username is required';
    } else if (!/^[A-Za-z0-9_]+$/.test(formData.userName)) {
      newErrors.userName = 'Username must contain only letters, numbers, and underscores';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[^0-9]/g, ''))) {
      newErrors.phoneNumber = 'Phone number should be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confPassword) {
      newErrors.confPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confPassword) {
      newErrors.confPassword = 'Passwords do not match';
    }

    if (!formData.institution) {
      newErrors.institution = 'Institution is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // if there are validation errors, do not proceed with registration and auto scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0].scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    setRegisterError('');

    try {
      const result = await register(formData);

      if (result.success) {
        toastUtil.success(result.message || 'Registration successful! Please verify your email.');

        // Store verification data in secure sessionStorage for the verification page
        if (result.verificationData) {
          secureSessionStorage.setItem('verificationData', result.verificationData);
          // Redirect to email verification page
          navigate('/verify-email', { state: { from: location.state?.from } });
        } else {
          navigate('/login', { state: { from: location.state?.from } });
        }
      } else {
        // If registration failed, set the error message and scroll to the top
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
        setRegisterError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
      setRegisterError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container register-form">
        <Link to="/" className="back-to-home">
          <IoArrowBackOutline /> Back to Home
        </Link>

        <div className="form-heading">
          <h1>Create an Account</h1>
          <p>Sign up to start submitting articles to journals</p>
        </div>

        {registerError && (
          <Alert
            type="error"
            message={registerError}
            onClose={() => setRegisterError('')}
          />
        )}

        <form onSubmit={handleSubmit}>
          {/* Name row */}
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
              autoComplete="given-name"
              icon={<IoPersonOutline />}
            />
            
            <FormField
              label="Middle Name (Optional)"
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Enter middle name"
              error={errors.middleName}
              autoComplete="additional-name"
              icon={<IoPersonCircleOutline />}
            />
            
          </div>

          {/* Last name and username row */}
          <div className="form-row">
            <FormField
              label="Last Name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              error={errors.lastName}
              required
              autoComplete="family-name"
              icon={<IoPersonOutline />}
            />
              <FormField
              label="Username"
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Choose a username"
              error={errors.userName}
              required
              autoComplete="username"
              icon={<IoAtOutline />}              actionButton={
                <button 
                  type="button" 
                  onClick={generateUsername} 
                  aria-label="Auto-generate username"
                  title="Generate username from your first name"
                >
                  <IoRefreshOutline />
                </button>
              }
            />
          </div>

          {/* Email and phone row */}
          <div className="form-row">
            <FormField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              required
              autoComplete="email"
              icon={<IoMailOutline />}
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
              autoComplete="tel"
              icon={<IoCallOutline />}
            />
          </div>

          {/* Institution and DOB row */}
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
              autoComplete="organization"
              icon={<IoSchoolOutline />}
            />

            <DateField
              label="Date of Birth (Optional)"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              autoComplete="bday"
              placeholder="Select your date of birth"
              maxDate={new Date().toISOString().split('T')[0]} // Today's date as max
              icon={<IoCalendarOutline />}
            />
          </div>

          {/* Password row */}
          <div className="form-row">
            <FormField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              error={errors.password}
              required
              autoComplete="new-password"
              icon={<IoLockClosedOutline />}
            />

            <FormField
              label="Confirm Password"
              type="password"
              name="confPassword"
              value={formData.confPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              error={errors.confPassword}
              required
              autoComplete="new-password"
              icon={<IoLockClosedOutline />}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span className="button-text">Registering...</span>
                </>
              ) : (
                <>
                  <IoPersonAddOutline />
                  <span className="button-text">Register</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="auth-link">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
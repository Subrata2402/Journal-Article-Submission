import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { IoLogInOutline, IoWarningOutline, IoArrowBackOutline } from 'react-icons/io5';
import FormField from '../../components/forms/FormField';
import CustomCheckbox from '../../components/forms/CustomCheckbox';
import { useAuth } from '../../contexts/AuthContext';
import toastUtil from '../../utils/toastUtil';
import { secureSessionStorage } from '../../utils/storageUtil';
import '../../assets/styles/pages/auth.scss';
import { getRedirectionUrl } from '../../utils/redirectionUtils';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectionToken = searchParams.get('redirection_token');

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Handle form field changes
  // This function updates the form data state and clears any errors related to the field being changed
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

  const handleRememberMeChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      rememberMe: checked,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        navigate(getRedirectionUrl(redirectionToken));
      } else if (result.error === 'Email not verified' && result.verificationData) {
        // Instead of redirecting, show verification option
        setNeedsVerification(true);
        setVerificationData(result.verificationData);
        toastUtil.warning('Email verification required before you can login');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle redirect to verification page
  const handleVerificationRedirect = () => {
    if (verificationData) {
      // Store verification data in secure session storage for use on the verification page
      secureSessionStorage.setItem('verificationData', verificationData);
      navigate('/verify-email' + location.search);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <Link to="/" className="back-to-home">
          <IoArrowBackOutline /> Back to Home
        </Link>

        <div className="form-heading">
          <h1>Welcome Back</h1>
          <p>Log in to your account to access the Article Submission System</p>
        </div>

        {needsVerification ? (
          <div className="verification-required">
            <div className="verification-warning">
              <IoWarningOutline className="warning-icon" />
              <div className="warning-text">
                <strong>Email verification required</strong>
                <p>Your email address ({verificationData?.user?.email}) needs to be verified before you can login.</p>
              </div>
            </div>
            <div className="form-actions">
              <button
                className="login-button"
                onClick={handleVerificationRedirect}
              >
                Proceed to Verification
              </button>
            </div>
            <div className="auth-additional-options verification-options">
              <button
                type="button"
                className="back-to-login"
                onClick={() => setNeedsVerification(false)}
              >
                <IoArrowBackOutline /> Back to login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormField
              label="Email or Username"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email or username"
              error={errors.email}
              required
              autoComplete="email"
            />

            <FormField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              autoComplete="current-password"
            />
            <div className="auth-additional-options">
              <div className="remember-me">
                <CustomCheckbox
                  id="remember"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleRememberMeChange}
                  label="Remember me"
                />
              </div>
              <Link to={`/forgot-password${location.search}`} className="auth-link">Forgot password?</Link>
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
                    <span className="button-text">Logging in...</span>
                  </>
                ) : (
                  <>
                    <IoLogInOutline />
                    <span className="button-text">Log In</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to={`/register${location.search}`} className="auth-link">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
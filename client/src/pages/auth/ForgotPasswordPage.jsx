import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { IoMailOutline, IoArrowBackOutline, IoSendOutline } from 'react-icons/io5';
import FormField from '../../components/forms/FormField';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import toastUtil from '../../utils/toastUtil';
import { secureSessionStorage } from '../../utils/storageUtil';
import '../../assets/styles/pages/auth.scss';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [resetData, setResetData] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let intervalId;
    if (resendTimer > 0) {
      intervalId = setInterval(() => {
        setResendTimer(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [resendTimer]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await httpService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });

      if (response.data.success) {
        setRequestSent(true);
        setResetData(response.data.data);
        setResendTimer(45); // Start 45 second timer
        toastUtil.success('Password reset instructions sent to your email');
      } else {
        setError(response.data.message || 'Failed to send reset instructions');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const handleProceedToReset = () => {
    if (resetData) {
      // Store the reset data in secure session storage for the reset page
      secureSessionStorage.setItem('passwordResetData', {
        email,
        otpVerificationToken: resetData.otpVerificationToken,
        resetPasswordToken: resetData.resetPasswordToken
      });
      navigate('/reset-password', {
        state: { from: location.state?.from }
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <div className="form-heading">
          <h1>Forgot Password</h1>
          <p>Enter your email to receive a password reset code</p>
        </div>

        {requestSent ? (
          <div className="password-reset-confirmation">
            <div className="success-message">
              <div className="success-icon">
                <IoMailOutline />
              </div>
              <h3>Check your email</h3>
              <p>We've sent a password reset code to <strong>{email}</strong>. Please check your inbox and spam folder.</p>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="login-button"
                onClick={handleProceedToReset}
              >
                Continue to Reset Password
              </button>
            </div>

            <div className="auth-additional-options">
              <p>
                Didn't receive the email?
                <button
                  type="button"
                  className="resend-button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || isLoading}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Send again'}
                </button>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormField
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your registered email"
              error={error}
              required
              autoComplete="email"
              icon={<IoMailOutline />}
            />

            <div className="form-actions">
              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span className="button-text">Sending...</span>
                  </>
                ) : (
                  <>
                    <IoSendOutline />
                    <span className="button-text">Send Reset Instructions</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" state={{ from: location.state?.from }} className="back-to-login">
            <IoArrowBackOutline /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
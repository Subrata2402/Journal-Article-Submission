import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  IoLockClosedOutline, 
  IoArrowBackOutline, 
  IoCheckmarkCircleOutline, 
  IoWarningOutline 
} from 'react-icons/io5';
import FormField from '../../components/forms/FormField';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import toastUtil from '../../utils/toastUtil';
import { secureSessionStorage } from '../../utils/storageUtil';
import '../../assets/styles/pages/auth.scss';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [resetComplete, setResetComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetData, setResetData] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Retrieve data from secure session storage that was stored in ForgotPasswordPage
    const storedData = secureSessionStorage.getItem('passwordResetData', true);
    if (!storedData) {
      toastUtil.error('Reset data is missing');
      navigate('/forgot-password');
      return;
    }
    
    try {
      setResetData(storedData);
      setFormData(prev => ({
        ...prev,
        email: storedData.email
      }));
    } catch (error) {
      console.error('Failed to parse reset data', error);
      toastUtil.error('Invalid reset data');
      navigate('/forgot-password');
    }
  }, [navigate]);
  
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
    const { name, value } = e.target;
    
    // For OTP field, only allow numbers and limit to 6 characters
    if (name === 'otp') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 6) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = 'Verification code is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'Verification code must be 6 digits';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!resetData) {
      toastUtil.error('Reset data is missing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const payload = {
        email: formData.email,
        password: formData.newPassword,
        confPassword: formData.confirmPassword,
        resetPasswordToken: resetData.resetPasswordToken,
        verificationCode: formData.otp
      };
      
      const response = await httpService.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
      
      if (response.data.success) {
        setResetComplete(true);
        toastUtil.success(response.data.message || 'Password reset successfully!');
        // Clean up session storage
        secureSessionStorage.removeItem('passwordResetData');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toastUtil.error(response.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toastUtil.error(error.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (!resetData?.email) {
      toastUtil.error('Email is missing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await httpService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: resetData.email });
      
      if (response.data.success) {
        // Update reset data with new tokens
        const newResetData = {
          ...resetData,
          otpVerificationToken: response.data.data.otpVerificationToken,
          resetPasswordToken: response.data.data.resetPasswordToken
        };
        
        setResetData(newResetData);
        secureSessionStorage.setItem('passwordResetData', newResetData);
        
        setFormData(prev => ({
          ...prev,
          otp: ''
        }));
        
        setResendTimer(45); // Start 45 second timer
        toastUtil.success(response.data.message || 'A new verification code has been sent to your email');
      } else {
        toastUtil.error(response.data.message || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toastUtil.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!resetData) {
    return (
      <div className="auth-page">
        <div className="form-container">
          <div className="form-heading">
            <h1>Reset Password</h1>
            <p>Loading reset data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-page">
      <div className="form-container">
        <div className="form-heading">
          <h1>Reset Your Password</h1>
          <p>Enter the verification code and your new password</p>
        </div>
        
        {resetComplete ? (
          <div className="reset-success">
            <div className="verification-success">
              <div className="success-icon">
                <IoCheckmarkCircleOutline />
              </div>
              <div className="success-message">
                <h3>Password Reset Complete</h3>
                <p>Your password has been successfully updated. You will be redirected to the login page.</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="reset-instruction">
              <div className="verification-warning">
                <IoWarningOutline className="warning-icon" />
                <div className="warning-text">
                  <strong>Check your email</strong>
                  <p>We've sent a verification code to {resetData.email}. Please enter it below.</p>
                </div>
              </div>
            </div>
          
            <form onSubmit={handleSubmit}>
              <FormField
                label="Verification Code"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Enter 6-digit verification code"
                error={errors.otp}
                required
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                className="verification-code-input"
              />
              
              <FormField
                label="New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                error={errors.newPassword}
                required
                autoComplete="new-password"
                icon={<IoLockClosedOutline />}
              />
              
              <FormField
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
                icon={<IoLockClosedOutline />}
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
                      <span className="button-text">Resetting password...</span>
                    </>
                  ) : (
                    <span className="button-text">Reset Password</span>
                  )}
                </button>
              </div>
              
              <div className="auth-additional-options">
                <button 
                  type="button" 
                  className="resend-button" 
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isLoading}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
                </button>
              </div>
            </form>
          </>
        )}
        
        <div className="auth-footer">
          <Link to="/login" className="back-to-login">
            <IoArrowBackOutline /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { IoCheckmarkCircleOutline, IoArrowBackOutline, IoWarningOutline } from 'react-icons/io5';
import FormField from '../../components/forms/FormField';
import httpService from '../../services/httpService';
import { API_ENDPOINTS } from '../../config/api';
import toastUtil from '../../utils/toastUtil';
import { secureSessionStorage } from '../../utils/storageUtil';
import '../../assets/styles/pages/auth.scss';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [resendTimer, setResendTimer] = useState(0); // Timer for resend button
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedData = secureSessionStorage.getItem('verificationData', true);
    if (!storedData) {
      toastUtil.error('Verification data is missing');
      navigate('/login');
      return;
    }
    
    try {
      setVerificationData(storedData);
      
      // Start the initial 40-second timer when verification page loads
      setResendTimer(40);
    } catch (error) {
      console.error('Failed to parse verification data', error);
      toastUtil.error('Invalid verification data');
      navigate('/login');
    }
  }, [navigate]);
  
  // Timer countdown effect
  useEffect(() => {
    let timerId;
    
    if (resendTimer > 0) {
      timerId = setTimeout(() => {
        setResendTimer(prevTime => prevTime - 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [resendTimer]);
  
  const handleChange = (e) => {
    // Allow only numeric input for OTP
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    // Limit to 6 digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp) {
      toastUtil.warning('Please enter the verification code');
      return;
    }
    
    if (!verificationData) {
      toastUtil.error('Verification data is missing');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare the payload for the verification API
      const payload = {
        email: verificationData.user.email,
        verificationCode: otp,
        verificationToken: verificationData.emailVerificationToken
      };
      
      const response = await httpService.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
      
      if (response.data.success) {
        setSuccess(true);
        toastUtil.success(response.data.message || 'Email verified successfully!');
        secureSessionStorage.removeItem('verificationData');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toastUtil.error(response.data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      toastUtil.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    if (!verificationData) {
      toastUtil.error('Verification data is missing');
      return;
    }
    
    setResendLoading(true);
    
    try {
      const payload = {
        email: verificationData.user.email,
        verificationToken: verificationData.otpVerificationToken || verificationData.otpVerficationToken
      };
      
      const response = await httpService.post(API_ENDPOINTS.AUTH.SEND_OTP, payload);
      
      if (response.data.success) {
        // Update verification data with new tokens
        const newVerificationData = {
          ...verificationData,
          otpVerificationToken: response.data.data.otpVerificationToken,
          emailVerificationToken: response.data.data.emailVerificationToken
        };
        
        setVerificationData(newVerificationData);
        secureSessionStorage.setItem('verificationData', newVerificationData);
        
        setOtp('');
        toastUtil.success(response.data.message || 'A new verification code has been sent to your email');
        
        // Reset the timer to 40 seconds after successful resend
        setResendTimer(40);
      } else {
        toastUtil.error(response.data.message || 'Failed to resend verification code');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toastUtil.error(error.response?.data?.message || 'Failed to resend verification code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };
  
  if (!verificationData) {
    return (
      <div className="auth-page">
        <div className="form-container">
          <div className="form-heading">
            <h1>Email Verification</h1>
            <p>Loading verification data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="auth-page">
      <div className="form-container">
        <div className="form-heading">
          <h1>Email Verification</h1>
          <p>Please enter the verification code sent to {verificationData.user.email}</p>
        </div>
        
        {/* Add prominent verification warning message */}
        {!success && (
          <div className="verification-warning">
            <IoWarningOutline className="warning-icon" />
            <div className="warning-text">
              <strong>Email verification required</strong>
              <p>Your account has been created but requires email verification before you can login.</p>
            </div>
          </div>
        )}
        
        {success ? (
          <div className="verification-success">
            <div className="success-message">
              <h3>Email Verified</h3>
              <p>Your email has been successfully verified. You will be redirected to the login page.</p>
            </div>
            <div className="verification-icon">
              <IoCheckmarkCircleOutline />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormField
              label="Verification Code"
              type="text"
              name="otp"
              value={otp}
              onChange={handleChange}
              placeholder="Enter 6-digit verification code"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              className="verification-code-input"
            />
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    <span className="button-text">Verifying...</span>
                  </>
                ) : (
                  <span className="button-text">Verify Email</span>
                )}
              </button>
            </div>
            
            <div className="auth-additional-options verification-options">
              <button 
                type="button" 
                className="resend-button" 
                onClick={handleResendOtp}
                disabled={resendLoading || resendTimer > 0}
              >
                {resendLoading 
                  ? 'Sending...' 
                  : resendTimer > 0 
                    ? `Resend code in ${resendTimer}s` 
                    : 'Resend verification code'
                }
              </button>
              
              <Link to="/login" className="back-to-login">
                <IoArrowBackOutline /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
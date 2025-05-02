import React, { createContext, useContext, useState, useEffect } from 'react';
import httpService from '../services/httpService';
import { API_ENDPOINTS } from '../config/api';
import toastUtil from '../utils/toastUtil';
import { secureLocalStorage } from '../utils/storageUtil';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState(secureLocalStorage.getItem('authToken'));

  // Check if user is authenticated on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!authToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Set auth token for API requests
        httpService.setAuthToken(authToken);
        
        // Try to get user data from localStorage first
        const storedUser = secureLocalStorage.getItem('userData', true);
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        }
        
        // Then fetch fresh data from the API
        const response = await httpService.get(API_ENDPOINTS.AUTH.PROFILE_DETAILS);
        
        if (response.data && response.data.success) {
          const userData = response.data.data;
          setUser(userData);
          setIsAuthenticated(true);
          // Store updated user data
          secureLocalStorage.setItem('userData', userData);
        } else {
          // Token is invalid or expired
          logout();
        }
      } catch (error) {
        console.error('Token verification failed', error);
        // Clear invalid token
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [authToken]);

  // Login function
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await httpService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      if (response.data && response.data.success) {
        const { accessToken, user: userData } = response.data.data;
        
        if (accessToken && userData) {
          // Store token in localStorage
          secureLocalStorage.setItem('authToken', accessToken);
          // Store user data in localStorage
          secureLocalStorage.setItem('userData', userData);
          
          httpService.setAuthToken(accessToken);
          setAuthToken(accessToken);
          setUser(userData);
          setIsAuthenticated(true);
          toastUtil.success('Login successful!');
          return { success: true };
        }
      } else if (response.data && !response.data.success && response.data.data?.needsVerification) {
        // Don't show toast here since we'll show it in the component
        return {
          success: false, 
          error: 'Email not verified',
          verificationData: response.data.data
        };
      }
      
      // Handle generic error case
      toastUtil.error(response.data?.message || 'Login failed. Please check your credentials.');
      return { 
        success: false, 
        error: response.data?.message || 'Login failed. Please check your credentials.'
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle 403 status code for unverified email
      if (error.response && error.response.status === 403 && 
          error.response.data?.data?.needsVerification) {
        // Don't show toast here since we'll show it in the component
        return {
          success: false,
          error: 'Email not verified',
          verificationData: error.response.data.data
        };
      }
      
      // Handle other errors
      toastUtil.error(error.response?.data?.message || 'An error occurred during login');
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during login'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await httpService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      if (response.data && response.data.success) {
        return { 
          success: true,
          message: response.data.message,
          verificationData: response.data.data
        };
      } else {
        return { 
          success: false, 
          error: response.data?.message || 'Registration failed. Please try again.'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'An error occurred during registration'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Send logout request to API if user is authenticated
    if (isAuthenticated && authToken) {
      httpService.get(API_ENDPOINTS.AUTH.LOGOUT)
        .catch(error => console.error('Logout error:', error));
    }
    
    // Clear all auth data from localStorage
    secureLocalStorage.removeItem('authToken');
    secureLocalStorage.removeItem('userData');
    
    httpService.setAuthToken(null);
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Auth context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
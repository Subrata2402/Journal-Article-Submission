import { API_BASE_URL } from './constants';

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  JOURNALS: {
    LIST: '/journal/journal-list',
    CATEGORIES: '/journal/categories',
    TAGS: '/journal/tags',
    DETAIL: (id) => `/journal/${id}`,
    CREATE: '/journal/create',
    UPDATE: (id) => `/journal/${id}/update`,
    DELETE: (id) => `/journal/${id}/delete`,
  },
  ARTICLES: {
    USER_ARTICLE_LIST: '/article/user-article-list',
    SUBMIT: '/article/add-article',
    DETAIL: (id) => `/article/article-details/${id}`,
    DELETE: (id) => `/article/delete-article/${id}`,
    UPDATE: (id) => `/article/update-article/${id}`,
  },
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    VERIFY_EMAIL: '/auth/verify-email',
    SEND_OTP: '/auth/send-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    PROFILE_DETAILS: '/auth/user/profile-details',
    UPDATE_PROFILE: '/auth/user/update-profile',
  },
};

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Formats API errors for consistent error handling
 */
export const formatApiError = (error) => {
  if (error.response) {
    // Server responded with a status code outside the 2xx range
    return {
      status: error.response.status,
      message: error.response.data?.message || 'An error occurred with the server response',
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      status: 0,
      message: 'No response received from server. Please check your connection.',
      data: null
    };
  } else {
    // Error setting up the request
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred',
      data: null
    };
  }
};

/**
 * Get full URL (with base URL)
 */
export const getFullUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
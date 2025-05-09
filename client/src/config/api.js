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
    DETAIL: (id) => `/journal/journal-details/${id}`,
    CREATE: '/journal/create',
    UPDATE: (id) => `/journal/update-journal/${id}`,
    DELETE: (id) => `/journal/delete-journal/${id}`,
    ADD: '/journal/add-journal',
  },
  REVIEWER: {
    LIST: '/reviewer/reviewer-list',
    DETAIL: (id) => `/reviewer/reviewer-details/${id}`,
    ADD: '/reviewer/add-reviewer',
    ADD_BULK_REVIEWERS: '/reviewer/add-bulk-reviewers',
    UPDATE: (id) => `/reviewer/${id}/update`,
    DELETE: (id) => `/reviewer/delete-reviewer/${id}`,
  },
  ARTICLES: {
    ARTICLE_LIST: '/article/article-list',
    EDITOR_ARTICLES: '/article/editor-articles',
    SUBMIT: '/article/add-article',
    DETAIL: (id) => `/article/article-details/${id}`,
    DELETE: (id) => `/article/delete-article/${id}`,
    UPDATE: (id) => `/article/update-article/${id}`,
    REMOVE_REVIEWER: (articleId, reviewerId) => `/article/remove-reviewer?articleId=${articleId}&reviewerId=${reviewerId}`,
    ASSIGN_REVIEWER: (articleId, reviewerId) => `/article/assign-reviewer?articleId=${articleId}&reviewerId=${reviewerId}`,
    ADD_FINAL_REVIEW: '/article/add-final-review',
    REVIEW_ARTICLE_LIST: '/article/review-article-list',
    ADD_REVIEW: '/article/add-review',
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
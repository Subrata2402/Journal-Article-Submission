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
    LIST: '/v1/journal/journal-list',
    CATEGORIES: '/v1/journal/categories',
    TAGS: '/v1/journal/tags',
    DETAIL: (id) => `/v1/journal/journal-details/${id}`,
    CREATE: '/v1/journal/create',
    UPDATE: (id) => `/v1/journal/update-journal/${id}`,
    DELETE: (id) => `/v1/journal/delete-journal/${id}`,
    ADD: '/v1/journal/add-journal',
    ADD_EDITOR: `/v1/journal/add-editor`,
  },
  REVIEWER: {
    LIST: '/v1/reviewer/reviewer-list',
    DETAIL: (id) => `/v1/reviewer/reviewer-details/${id}`,
    ADD: '/v1/reviewer/add-reviewer',
    ADD_BULK_REVIEWERS: '/v1/reviewer/add-bulk-reviewers',
    UPDATE: (id) => `/v1/reviewer/${id}/update`,
    DELETE: (id) => `/v1/reviewer/delete-reviewer/${id}`,
  },
  ARTICLES: {
    ARTICLE_LIST: '/v1/article/article-list',
    EDITOR_ARTICLES: '/v1/article/editor-articles',
    SUBMIT: '/v1/article/add-article',
    DETAIL: (id) => `/v1/article/article-details/${id}`,
    DELETE: (id) => `/v1/article/delete-article/${id}`,
    UPDATE: (id) => `/v1/article/update-article/${id}`,
    REMOVE_REVIEWER: (articleId, reviewerId) => `/v1/article/remove-reviewer?articleId=${articleId}&reviewerId=${reviewerId}`,
    ASSIGN_REVIEWER: (articleId, reviewerId) => `/v1/article/assign-reviewer?articleId=${articleId}&reviewerId=${reviewerId}`,
    ADD_FINAL_REVIEW: '/v1/article/add-final-review',
    REVIEW_ARTICLE_LIST: '/v1/article/review-article-list',
    ADD_REVIEW: '/v1/article/add-review',
  },
  AUTH: {
    LOGIN: '/v1/auth/login',
    REGISTER: '/v1/auth/register',
    LOGOUT: '/v1/auth/logout',
    VERIFY_EMAIL: '/v1/auth/verify-email',
    SEND_OTP: '/v1/auth/send-otp',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
    PROFILE_DETAILS: '/v1/auth/user/profile-details',
    UPDATE_PROFILE: '/v1/auth/user/update-profile',
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
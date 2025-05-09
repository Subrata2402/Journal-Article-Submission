import httpService from './httpService';
import { API_ENDPOINTS } from '../config/api';

/**
 * Get articles submitted by the current user
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} - Articles data with pagination
 */
const getUserArticles = async (page = 1, limit = 10) => {
  try {
    const response = await httpService.get(
      `${API_ENDPOINTS.ARTICLES.ARTICLE_LIST}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user articles:', error);
    throw error;
  }
};

/**
 * Get article details by ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} - Article data
 */
const getArticleById = async (id) => {
  try {
    const response = await httpService.get(`${API_ENDPOINTS.ARTICLES.DETAIL(id)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    throw error;
  }
};

/**
 * Submit a new article
 * @param {Object} articleData - Article data to submit
 * @returns {Promise<Object>} - Response data
 */
const submitArticle = async (articleData) => {
  try {
    const response = await httpService.post(
      API_ENDPOINTS.ARTICLES.SUBMIT,
      articleData
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting article:', error);
    throw error;
  }
};

/**
 * Update an existing article
 * @param {string} id - Article ID
 * @param {FormData} articleData - Updated article data (FormData object)
 * @returns {Promise<Object>} - Response data
 */
const updateArticle = async (id, articleData) => {
  try {
    const response = await httpService.put(
      API_ENDPOINTS.ARTICLES.UPDATE(id),
      articleData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating article with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an article by ID
 * @param {string} id - Article ID
 * @returns {Promise<Object>} - Response data
 */
const deleteArticle = async (id) => {
  try {
    const response = await httpService.delete(`${API_ENDPOINTS.ARTICLES.DELETE(id)}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting article with id ${id}:`, error);
    throw error;
  }
};

/**
 * Get articles assigned to the editor
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} - Articles data with pagination
 */
const getEditorArticles = async (page = 1, limit = 10) => {
  try {
    const response = await httpService.get(
      `${API_ENDPOINTS.ARTICLES.ARTICLE_LIST}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching editor articles:', error);
    throw error;
  }
};

/**
 * Update article status and comment (final review)
 * @param {string} articleId - Article ID
 * @param {Object} data - Status update data { status, comment }
 * @returns {Promise<Object>} - Response data
 */
const updateArticleStatus = async (articleId, data) => {
  try {
    const response = await httpService.post(
      API_ENDPOINTS.ARTICLES.ADD_FINAL_REVIEW,
      {
        articleId,
        status: data.status,
        comment: data.comment
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating final review for article ${articleId}:`, error);
    throw error;
  }
};

/**
 * Add a reviewer to an article
 * @param {string} articleId - Article ID
 * @param {string} reviewerId - Reviewer ID to add
 * @returns {Promise<Object>} - Response data
 */
const addReviewer = async (articleId, reviewerId) => {
  try {
    const response = await httpService.patch(
      API_ENDPOINTS.ARTICLES.ASSIGN_REVIEWER(articleId, reviewerId),
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding reviewer to article ${articleId}:`, error);
    throw error;
  }
};

/**
 * Remove a reviewer from an article
 * @param {string} articleId - Article ID
 * @param {string} reviewerId - Reviewer ID to remove
 * @returns {Promise<Object>} - Response data
 */
const removeReviewer = async (articleId, reviewerId) => {
  try {
    const response = await httpService.patch(
      API_ENDPOINTS.ARTICLES.REMOVE_REVIEWER(articleId, reviewerId)
    );
    return response.data;
  } catch (error) {
    console.error(`Error removing reviewer ${reviewerId} from article ${articleId}:`, error);
    throw error;
  }
};

/**
 * Get list of available reviewers
 * @returns {Promise<Object>} - Response data with reviewers
 */
const getAvailableReviewers = async () => {
  try {
    const response = await httpService.get(
      API_ENDPOINTS.REVIEWER.LIST
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching available reviewers:', error);
    throw error;
  }
};

/**
 * Get list of available reviewers
 * @returns {Promise<Object>} - Response data with reviewers
 */
const getReviewerList = async () => {
  try {
    const response = await httpService.get(
      API_ENDPOINTS.REVIEWER.LIST
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reviewers list:', error);
    throw error;
  }
};

/**
 * Get articles assigned to the current reviewer
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @param {string} status - Filter by review status (pending, completed, all)
 * @returns {Promise<Object>} - Articles data with pagination
 */
async function getReviewArticles(page = 1, limit = 10, status = 'pending') {
  try {
    let endpoint = `${API_ENDPOINTS.ARTICLES.REVIEW_ARTICLE_LIST}?page=${page}&limit=${limit}`;
    
    // Add status filter if provided and not 'all'
    if (status && status !== 'all') {
      endpoint += `&status=${status}`;
    }
    
    const response = await httpService.get(endpoint);
    return {
      success: true,
      articles: response.data.data.articles || [],
      pagination: response.data.data.pagination || {
        total: 0,
        page: page,
        limit: limit,
        totalPages: 0
      },
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching articles for review:', error);
    if (error.response && error.response.data) {
      throw {
        success: false,
        message: error.response.data.message || 'Failed to fetch articles for review',
        status: error.response.status
      };
    }
    throw {
      success: false,
      message: error.message || 'An error occurred while connecting to the server',
      status: 500
    };
  }
}

/**
 * Submit a review for an article
 * @param {string} articleId - Article ID
 * @param {string} status - Review status (approved/rejected)
 * @param {string} comment - Review comment
 * @returns {Promise<Object>} - Response data
 */
const submitReview = async (articleId, status, comment) => {
  try {
    const response = await httpService.post(
      API_ENDPOINTS.ARTICLES.ADD_REVIEW,
      {
        articleId,
        status,
        comment
      }
    );
    return {
      success: true,
      message: response.data.message || 'Review submitted successfully'
    };
  } catch (error) {
    console.error(`Error submitting review for article ${articleId}:`, error);
    if (error.response && error.response.data) {
      throw {
        success: false,
        message: error.response.data.message || 'Failed to submit review',
        status: error.response.status
      };
    }
    throw {
      success: false,
      message: error.message || 'An error occurred while connecting to the server',
      status: 500
    };
  }
};

const articleService = {
  getUserArticles,
  getArticleById,
  submitArticle,
  updateArticle,
  deleteArticle,
  getEditorArticles,
  updateArticleStatus,
  addReviewer,
  removeReviewer,
  getAvailableReviewers,
  getReviewerList,
  getReviewArticles,
  submitReview
};

export default articleService;
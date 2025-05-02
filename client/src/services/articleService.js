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
      `${API_ENDPOINTS.ARTICLES.USER_ARTICLE_LIST}?page=${page}&limit=${limit}`
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

const articleService = {
  getUserArticles,
  getArticleById,
  submitArticle
};

export default articleService;
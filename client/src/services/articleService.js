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

const articleService = {
  getUserArticles,
  getArticleById,
  submitArticle,
  updateArticle,
  deleteArticle
};

export default articleService;
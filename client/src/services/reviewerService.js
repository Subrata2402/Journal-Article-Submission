import httpService from './httpService';
import { API_ENDPOINTS } from '../config/api';

/**
 * Get list of all reviewers with pagination
 * @param {number} page - Page number
 * @param {number} limit - Number of items per page
 * @returns {Promise<Object>} - Reviewers data with pagination
 */
const getReviewers = async (page = 1, limit = 10) => {
  try {
    const response = await httpService.get(`${API_ENDPOINTS.REVIEWER.LIST}?page=${page}&limit=${limit}`);
    return {
      success: true,
      reviewers: response.data.data.reviewers || [],
      pagination: response.data.data.pagination || {
        total: 0,
        page: 1,
        limit: limit,
        totalPages: 0
      },
      message: response.data.message
    };
  } catch (error) {
    console.error('Error fetching reviewers:', error);
    if (error.response && error.response.data) {
      throw {
        success: false,
        message: error.response.data.message || 'Failed to fetch reviewers',
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

/**
 * Get reviewer details by ID
 * @param {string} id - Reviewer ID
 * @returns {Promise<Object>} - Reviewer data
 */
const getReviewerById = async (id) => {
  try {
    const response = await httpService.get(API_ENDPOINTS.REVIEWER.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviewer with id ${id}:`, error);
    throw error;
  }
};

/**
 * Add a new reviewer
 * @param {Object} reviewerData - Reviewer data to submit
 * @returns {Promise<Object>} - Response data
 */
const addReviewer = async (reviewerData) => {
  try {
    const response = await httpService.post(
      API_ENDPOINTS.REVIEWER.ADD,
      reviewerData
    );
    // For status code 201 or 200, return a standardized success response
    return {
      success: true,
      message: response.data.message || 'Reviewer added successfully',
      data: response.data
    };
  } catch (error) {
    console.error('Error adding reviewer:', error);
    // Extract the error message from the response if available
    if (error.response && error.response.data) {
      throw {
        success: false,
        message: error.response.data.message || 'Failed to add reviewer',
        status: error.response.status,
        data: error.response.data
      };
    }
    throw {
      success: false,
      message: error.message || 'An error occurred while connecting to the server',
      status: 500
    };
  }
};

/**
 * Add multiple reviewers in bulk by uploading a CSV file
 * @param {FormData} formData - FormData object containing the CSV file
 * @returns {Promise<Object>} - Response data
 */
const addBulkReviewers = async (formData) => {
  try {
    const response = await httpService.post(
      API_ENDPOINTS.REVIEWER.ADD_BULK_REVIEWERS,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return {
      success: true,
      message: response.data.message || 'Reviewers added successfully',
      data: response.data.data || []
    };
  } catch (error) {
    console.error('Error adding bulk reviewers:', error);
    if (error.response && error.response.data) {
      throw {
        success: false,
        message: error.response.data.message || 'Failed to upload reviewers',
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

/**
 * Update an existing reviewer
 * @param {string} id - Reviewer ID
 * @param {Object} reviewerData - Updated reviewer data
 * @returns {Promise<Object>} - Response data
 */
const updateReviewer = async (id, reviewerData) => {
  try {
    const response = await httpService.put(
      API_ENDPOINTS.REVIEWER.UPDATE(id),
      reviewerData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating reviewer with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a reviewer by ID
 * @param {string} id - Reviewer ID
 * @returns {Promise<Object>} - Response data
 */
const deleteReviewer = async (id) => {
  try {
    const response = await httpService.delete(API_ENDPOINTS.REVIEWER.DELETE(id));
    return {
      success: true,
      message: response.data.message || 'Reviewer deleted successfully'
    };
  } catch (error) {
    console.error(`Error deleting reviewer with id ${id}:`, error);
    if (error.response && error.response.data) {
      throw {
        success: false,
        message: error.response.data.message || 'Failed to delete reviewer',
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

const reviewerService = {
  getReviewers,
  getReviewerById,
  addReviewer,
  addBulkReviewers,
  updateReviewer,
  deleteReviewer
};

export default reviewerService;
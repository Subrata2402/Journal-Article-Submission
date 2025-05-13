import httpService from './httpService';
import { API_ENDPOINTS } from '../config/api';
import { secureLocalStorage } from '../utils/storageUtil';

const PINNED_JOURNALS_KEY = 'pinnedJournals';

const getJournalList = async (page = 1, limit = 10) => {
  try {
    const response = await httpService.get(
      `${API_ENDPOINTS.JOURNALS.LIST}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching journals:', error);
    // Throw a standardized error that includes the original error message
    throw {
      message: error.response?.data?.message || 'Failed to fetch journals',
      status: error.response?.status || 500,
      originalError: error
    };
  }
};

const getJournalById = async (id) => {
  try {
    const response = await httpService.get(API_ENDPOINTS.JOURNALS.DETAIL(id));
    return response.data;
  } catch (error) {
    console.error(`Error fetching journal with id ${id}:`, error);
    throw error;
  }
};

const createJournal = async (journalData) => {
  try {
    const response = await httpService.post(
      API_ENDPOINTS.JOURNALS.CREATE,
      journalData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating journal:', error);
    throw error;
  }
};

const updateJournal = async (id, journalData) => {
  try {
    const response = await httpService.put(
      API_ENDPOINTS.JOURNALS.UPDATE(id),
      journalData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating journal with id ${id}:`, error);
    throw error;
  }
};

const deleteJournal = async (id) => {
  try {
    const response = await httpService.delete(API_ENDPOINTS.JOURNALS.DELETE(id));
    return response.data;
  } catch (error) {
    console.error(`Error deleting journal with id ${id}:`, error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    const response = await httpService.get(API_ENDPOINTS.JOURNALS.CATEGORIES);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getTags = async () => {
  try {
    const response = await httpService.get(API_ENDPOINTS.JOURNALS.TAGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Pin journal functionality
const getPinnedJournals = () => {
  try {
    return secureLocalStorage.getItem(PINNED_JOURNALS_KEY, true) || [];
  } catch (error) {
    console.error('Error getting pinned journals from secure storage:', error);
    return [];
  }
};

const isPinned = (journalId) => {
  const pinnedJournals = getPinnedJournals();
  return pinnedJournals.includes(journalId);
};

const togglePinJournal = (journalId) => {
  try {
    const pinnedJournals = getPinnedJournals();
    const updatedPinnedJournals = pinnedJournals.includes(journalId)
      ? pinnedJournals.filter(id => id !== journalId)
      : [...pinnedJournals, journalId];
    
    secureLocalStorage.setItem(PINNED_JOURNALS_KEY, updatedPinnedJournals);
    return updatedPinnedJournals;
  } catch (error) {
    console.error('Error toggling pinned journal in secure storage:', error);
    return getPinnedJournals();
  }
};

const journalService = {
  getJournalList,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  getCategories,
  getTags,
  getPinnedJournals,
  isPinned,
  togglePinJournal
};

export default journalService;
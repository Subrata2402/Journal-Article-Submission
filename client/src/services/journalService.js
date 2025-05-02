import httpService from './httpService';
import { API_ENDPOINTS } from '../config/api';

const getJournalList = async (page = 1, limit = 10) => {
  try {
    const response = await httpService.get(
      `${API_ENDPOINTS.JOURNALS.LIST}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching journals:', error);
    throw error;
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

const journalService = {
  getJournalList,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  getCategories,
  getTags
};

export default journalService;
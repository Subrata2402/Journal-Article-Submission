import axios from 'axios';
import { API_CONFIG, REQUEST_TIMEOUT } from '../config/api';
import { secureLocalStorage } from '../utils/storageUtil';

class HttpService {
  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Get token from secureLocalStorage for each request if available
        const token = secureLocalStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Response interceptor to handle errors consistently
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Set auth token for API requests
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  get(url, config) {
    return this.client.get(url, config);
  }

  post(url, data, config) {
    return this.client.post(url, data, config);
  }

  put(url, data, config) {
    return this.client.put(url, data, config);
  }

  delete(url, config) {
    return this.client.delete(url, config);
  }

  patch(url, data, config) {
    return this.client.patch(url, data, config);
  }
}

const httpService = new HttpService();
export default httpService;
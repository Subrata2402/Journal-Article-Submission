import { decrypt, encrypt } from "./cryptoUtils";

/**
 * Enhanced localStorage with encryption
 */
export const secureLocalStorage = {
  setItem: (key, value) => {
    const encryptedValue = encrypt(value);
    localStorage.setItem(key, encryptedValue);
  },
  
  getItem: (key, isJSON = false) => {
    const encryptedValue = localStorage.getItem(key);
    return decrypt(encryptedValue, isJSON);
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};

/**
 * Enhanced sessionStorage with encryption
 */
export const secureSessionStorage = {
  setItem: (key, value) => {
    const encryptedValue = encrypt(value);
    sessionStorage.setItem(key, encryptedValue);
  },
  
  getItem: (key, isJSON = false) => {
    const encryptedValue = sessionStorage.getItem(key);
    return decrypt(encryptedValue, isJSON);
  },
  
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  },
  
  clear: () => {
    sessionStorage.clear();
  }
};

export default {
  secureLocalStorage,
  secureSessionStorage
};
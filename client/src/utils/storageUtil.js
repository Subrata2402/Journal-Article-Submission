import CryptoJS from 'crypto-js';

// Secret key for encryption (in production, store this in environment variables)
// This is just a default fallback - you should use an environment variable in production
const SECRET_KEY = 'journal-app-secure-storage-key';

/**
 * Encrypt a value before storing it
 * @param {any} value - The data to encrypt
 * @returns {string} - Encrypted string
 */
const encrypt = (value) => {
  if (!value) return null;
  const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return CryptoJS.AES.encrypt(valueStr, SECRET_KEY).toString();
};

/**
 * Decrypt a value retrieved from storage
 * @param {string} encryptedValue - The encrypted data
 * @param {boolean} isJSON - Whether to parse as JSON after decryption
 * @returns {any} - Decrypted value
 */
const decrypt = (encryptedValue, isJSON = false) => {
  if (!encryptedValue) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
    return isJSON ? JSON.parse(decryptedValue) : decryptedValue;
  } catch (error) {
    console.error('Error decrypting value:', error);
    return null;
  }
};

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
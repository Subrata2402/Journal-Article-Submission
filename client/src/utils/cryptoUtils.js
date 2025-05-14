import CryptoJS from 'crypto-js';

// Secret key for encryption (in production, store this in environment variables)
// This is just a default fallback - you should use an environment variable in production
const SECRET_KEY = 'journal-app-secure-storage-key';

/**
 * Encrypt a value before storing it
 * @param {any} value - The data to encrypt
 * @returns {string} - Encrypted string
 */
export const encrypt = (value) => {
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
export const decrypt = (encryptedValue, isJSON = false) => {
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
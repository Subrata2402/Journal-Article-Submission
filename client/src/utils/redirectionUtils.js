import { decrypt, encrypt } from "./cryptoUtils";

/**
 * Generates a secure token for redirection based on the current location.
 * @param {object} location - The current location object from React Router.
 * @returns {string} - The redirection token.
 */
const getSecureLocation = (location) => {
  if (location) {
    return encrypt(location.pathname + location.search);
  }
  return null;
}

/**
 * Generates a redirection token for the URL.
 * @param {object} location - The current location object from React Router.
 * @returns {string} - The redirection token as a query parameter.
 */
export const getRedirectionToken = (location) => {
  const token = getSecureLocation(location);
  return token ? `?redirection_token=${token}` : '';
};

/**
 * Retrieves the redirection URL from the encrypted token.
 * @param {string} value - The encrypted token.
 * @returns {string|null} - The decrypted redirection URL or null if decryption fails.
 */
export const getRedirectionUrl = (value) => {
  if (!value) return "/";
  try {
    const decryptedValue = decrypt(value, false);
    if (!decryptedValue) return "/";
    return decryptedValue;
  } catch (error) {
    console.error('Error decrypting value:', error);
    return "/";
  }
};
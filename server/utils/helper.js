const crypto = require("crypto");

/**
 * Generates a verification token using SHA-256 hashing algorithm.
 * The token is created by hashing a random 32-byte hex string.
 * @returns {string} The generated verification token.
 */
const generateVerificationToken = () => {
  const token = crypto.createHash("sha256").update(crypto.randomBytes(32).toString("hex")).digest("hex");
  return token;
};

/**
 * Generates a random password of specified length.
 * The password is created using random bytes, converted to base64,
 * and then formatted to include only uppercase letters and digits.
 * @param {number} length - The desired length of the password.
 * @returns {string} The generated random password.
 */
const generateRandomPassword = (length) => {
  const password = crypto.randomBytes(length + 4).toString("base64").slice(0, length);
  return password.toLocaleUpperCase().slice(0, length).replace(/[^A-Z0-9]/g, "S");
}

module.exports = {
  generateVerificationToken,
  generateRandomPassword,
};
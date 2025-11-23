// utils/randomImageName.js
const crypto = require("crypto");

/**
 * Generates a random hexadecimal string to use as a filename
 * @param {number} bytes - Number of bytes to generate (default 32)
 * @returns {string} Random hex string
 */
function randomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

module.exports = randomImageName;

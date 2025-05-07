/**
 * Shared validator utilities for both frontend and backend
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidEmail = (email) => {
  if (!email) return false;
  
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result
 */
exports.validatePassword = (password) => {
  const result = {
    isValid: false,
    errors: [],
  };
  
  if (!password || password.length < 8) {
    result.errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    result.errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    result.errors.push('Password must contain at least one special character');
  }
  
  result.isValid = result.errors.length === 0;
  
  return result;
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} - True if empty, false otherwise
 */
exports.isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

/**
 * Validate video file
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @param {Array} allowedTypes - Allowed MIME types
 * @returns {object} - Validation result
 */
exports.validateVideoFile = (file, maxSize = 100 * 1024 * 1024, allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv']) => {
  const result = {
    isValid: false,
    errors: [],
  };
  
  if (!file) {
    result.errors.push('No file provided');
    return result;
  }
  
  if (file.size > maxSize) {
    result.errors.push(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    result.errors.push(`File type ${file.type} is not supported. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  result.isValid = result.errors.length === 0;
  
  return result;
};

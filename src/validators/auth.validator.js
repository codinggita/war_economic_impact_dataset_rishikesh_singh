/**
 * Validators for Authentication requests.
 * Evaluates inputs and returns lists of formatting issues.
 */

/**
 * Validates registration request body payloads.
 * @param {object} data - req.body
 * @returns {string[]} Array of error strings, empty if payload is valid
 */
export const validateRegister = (data) => {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.push('Name is required and must be a valid string.');
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email)) {
    errors.push('A valid email address is required.');
  }

  if (!data.password || typeof data.password !== 'string' || data.password.length < 6) {
    errors.push('Password is required and must be at least 6 characters long.');
  }

  if (data.role && !['user', 'admin'].includes(data.role)) {
    errors.push("Role must be either 'user' or 'admin'.");
  }

  return errors;
};

/**
 * Validates login request body payloads.
 * @param {object} data - req.body
 * @returns {string[]} Array of error strings, empty if payload is valid
 */
export const validateLogin = (data) => {
  const errors = [];

  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
    errors.push('Email is required.');
  }

  if (!data.password || typeof data.password !== 'string' || data.password.trim() === '') {
    errors.push('Password is required.');
  }

  return errors;
};

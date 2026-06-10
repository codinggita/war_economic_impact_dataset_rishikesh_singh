import ApiError from '../utils/apiError.js';

/**
 * High-order Express middleware for validating request bodies.
 * Executes a validation helper function on the body of an incoming request.
 * If the validation yields error messages, it intercepts the request and forwards
 * a structured ApiError (400 Bad Request) to the centralized error handler.
 * 
 * @param {Function} validator - The validator function returning an array of error messages
 * @param {boolean} [isUpdate=false] - Optional flag indicating whether the validator should run in "update mode"
 * @returns {Function} Express middleware function
 */
export const validateBody = (validator, isUpdate = false) => {
  return (req, res, next) => {
    const errors = validator(req.body, isUpdate);
    
    if (errors.length > 0) {
      // Concatenate validation errors with clear separation
      const validationErrorMessage = errors.join(' | ');
      return next(new ApiError(400, `Validation Failed: ${validationErrorMessage}`));
    }
    
    next();
  };
};

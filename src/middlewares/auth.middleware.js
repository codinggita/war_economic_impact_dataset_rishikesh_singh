import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Route protection middleware.
 * Verifies that the client provided a valid Bearer JWT token in headers,
 * decodes the token, and attaches the associated user document to the request object.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check authorization header for Bearer token structure
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token value
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Hydrate user from database and attach to req.user (omitting password hash)
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return next(new ApiError(401, 'Not authorized, user account does not exist.'));
      }

      return next();
    } catch (error) {
      console.error(`[Auth Middleware Error] Verification failed: ${error.message}`);
      return next(new ApiError(401, 'Not authorized, token verification failed.'));
    }
  }

  // Token was not provided
  if (!token) {
    return next(new ApiError(401, 'Not authorized, no session token was provided.'));
  }
});

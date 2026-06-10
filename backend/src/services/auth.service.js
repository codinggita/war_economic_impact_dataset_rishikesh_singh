import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../utils/apiError.js';

/**
 * Generates a signed jsonwebtoken for a given user ID.
 * @param {string} userId - MongoDB ObjectID of the user
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'JWT_SECRET is missing from server configurations.');
  }
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d', // Session duration of 30 days
  });
};

/**
 * Registration service. Creates a user, hashes password via mongoose hooks, and issues a token.
 * 
 * @param {object} userData - User register attributes { name, email, password, role }
 * @returns {Promise<object>} Created user document (excluding password) and JWT auth token
 */
export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if email already exists in system database
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'An account is already registered with this email address.');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Strip password field from response object
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  const token = generateToken(user._id);

  return {
    user: userResponse,
    token,
  };
};

/**
 * Login verification service. Locates user by email, validates credentials, and generates a JWT.
 * 
 * @param {string} email - Request email parameter
 * @param {string} password - Request password parameter
 * @returns {Promise<object>} Authenticated user document and JWT auth token
 */
export const loginUser = async (email, password) => {
  // Explicitly select the password since it is marked as select: false by default in User Model
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Utilize the schema method to safely compare candidate passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Create clean user response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(user._id);

  return {
    user: userResponse,
    token,
  };
};

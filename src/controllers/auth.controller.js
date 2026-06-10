import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import * as authService from '../services/auth.service.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * @desc      Register new user in system
 * @route     POST /auth/register
 * @access    Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  
  const result = await authService.registerUser({ name, email, password, role });
  
  return new ApiResponse(
    HTTP_STATUS.CREATED,
    'User registered successfully.',
    result
  ).send(res);
});

/**
 * @desc      Authenticate user credentials and return session token
 * @route     POST /auth/login
 * @access    Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.loginUser(email, password);
  
  return new ApiResponse(
    HTTP_STATUS.OK,
    'User logged in successfully.',
    result
  ).send(res);
});

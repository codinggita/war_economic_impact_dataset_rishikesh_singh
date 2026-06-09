import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * @desc      Get API version and metadata information
 * @route     GET /version
 * @access    Public
 */
export const getVersion = asyncHandler(async (req, res) => {
  const payload = {
    name: 'War Economic Impact API',
    version: '1.0.0',
    description: 'A production-grade REST API managing global conflict economic impacts (unemployment, inflation, poverty, GDP loss, black market activity, war cost, and reconstruction cost).',
    environment: process.env.NODE_ENV || 'development',
  };

  return new ApiResponse(
    HTTP_STATUS.OK,
    'API version information fetched successfully.',
    payload
  ).send(res);
});

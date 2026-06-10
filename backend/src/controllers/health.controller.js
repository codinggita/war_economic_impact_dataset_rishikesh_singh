import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * @desc      Get API server health and database connection status
 * @route     GET /health
 * @access    Public
 */
export const getHealth = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  
  // Mongoose connection state mapping:
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const payload = {
    status: 'UP',
    message: 'API server is running and healthy.',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStateMap[dbState] || 'unknown',
      code: dbState,
    },
  };

  return new ApiResponse(
    HTTP_STATUS.OK,
    'Server health checked successfully.',
    payload
  ).send(res);
});

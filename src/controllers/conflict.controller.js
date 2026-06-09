import * as conflictService from '../services/conflict.service.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { parseQuery } from '../utils/queryParser.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * @desc      Create a new conflict record
 * @route     POST /conflicts
 * @access    Public
 */
export const createConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.createConflict(req.body);
  return new ApiResponse(
    HTTP_STATUS.CREATED,
    'Conflict record created successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Get all conflicts with paginated filtering
 * @route     GET /conflicts
 * @access    Public
 */
export const getAllConflicts = asyncHandler(async (req, res) => {
  const { filter, options } = parseQuery(req.query);
  const result = await conflictService.getConflicts(filter, options);
  
  const meta = {
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
    count: result.count
  };

  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflicts fetched successfully.',
    result.conflicts,
    meta
  ).send(res);
});

/**
 * @desc      Get a single conflict record by database ID
 * @route     GET /conflicts/:id
 * @access    Public
 */
export const getConflictById = asyncHandler(async (req, res) => {
  const conflict = await conflictService.getConflictById(req.params.id);
  if (!conflict) {
    res.status(404).json({
      success: false,
      message: 'Conflict not found'
    });
    return;
  }
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record retrieved successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Partially update an existing conflict record
 * @route     PATCH /conflicts/:id
 * @access    Public
 */
export const updateConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.updateConflict(req.params.id, req.body, false);
  if (!conflict) {
    res.status(404).json({
      success: false,
      message: 'Conflict not found'
    });
    return;
  }
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record updated successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Replace an entire conflict record (overwrite)
 * @route     PUT /conflicts/:id
 * @access    Public
 */
export const replaceConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.updateConflict(req.params.id, req.body, true);
  if (!conflict) {
    res.status(404).json({
      success: false,
      message: 'Conflict not found'
    });
    return;
  }
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record replaced successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Remove a conflict record
 * @route     DELETE /conflicts/:id
 * @access    Public
 */
export const deleteConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.deleteConflict(req.params.id);
  if (!conflict) {
    res.status(404).json({
      success: false,
      message: 'Conflict not found'
    });
    return;
  }
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record deleted successfully.',
    conflict
  ).send(res);
});

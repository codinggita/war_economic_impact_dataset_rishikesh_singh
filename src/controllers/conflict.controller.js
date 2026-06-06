import * as conflictService from '../services/conflict.service.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc      Create a new conflict record
 * @route     POST /conflicts
 * @access    Public
 */
export const createConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.createConflict(req.body);
  res.status(201).json({
    success: true,
    message: 'Conflict record created successfully.',
    data: conflict
  });
});

/**
 * @desc      Get all conflicts
 * @route     GET /conflicts
 * @access    Public
 */
export const getAllConflicts = asyncHandler(async (req, res) => {
  const conflicts = await conflictService.getConflicts();
  res.status(200).json({
    success: true,
    message: 'Conflicts fetched successfully.',
    data: conflicts
  });
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
  res.status(200).json({
    success: true,
    message: 'Conflict record retrieved successfully.',
    data: conflict
  });
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
  res.status(200).json({
    success: true,
    message: 'Conflict record updated successfully.',
    data: conflict
  });
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
  res.status(200).json({
    success: true,
    message: 'Conflict record replaced successfully.',
    data: conflict
  });
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
  res.status(200).json({
    success: true,
    message: 'Conflict record deleted successfully.',
    data: conflict
  });
});

import Conflict from '../models/conflict.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc      Create a new conflict record
 * @route     POST /conflicts
 * @access    Public
 */
export const createConflict = asyncHandler(async (req, res) => {
  const conflict = await Conflict.create(req.body);
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
  const conflicts = await Conflict.find();
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
  const conflict = await Conflict.findById(req.params.id);
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
  const conflict = await Conflict.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
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
  const conflict = await Conflict.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    overwrite: true,
    runValidators: true
  });
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
  const conflict = await Conflict.findByIdAndDelete(req.params.id);
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

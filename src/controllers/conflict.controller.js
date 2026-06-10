import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/apiResponse.js';
import { parseQuery } from '../utils/queryParser.js';
import * as conflictService from '../services/conflict.service.js';
import { HTTP_STATUS } from '../constants/index.js';

// ==========================================
// 1. Conflict CRUD Endpoints
// ==========================================

/**
 * @desc      Create a new conflict record
 * @route     POST /conflicts
 * @access    Private (Admin/User)
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
 * @desc      Get all conflicts with paginated filtering, search, and sorting
 * @route     GET /conflicts
 * @access    Public
 */
export const getAllConflicts = asyncHandler(async (req, res) => {
  // Parse incoming filter, search, sorting and paging parameters
  const { filter, options } = parseQuery(queryWithAliasedFilterFix(req.query));
  
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
 * Helper to handle specific aliasing requirements
 */
const queryWithAliasedFilterFix = (query) => {
  const cloned = { ...query };
  return cloned;
};

/**
 * @desc      Get a single conflict record by database ID
 * @route     GET /conflicts/:id
 * @access    Public
 */
export const getConflictById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const conflict = await conflictService.getConflictById(id);
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record retrieved successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Partially update an existing conflict record
 * @route     PATCH /conflicts/:id
 * @access    Private
 */
export const updateConflict = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const conflict = await conflictService.updateConflict(id, req.body, false);
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record updated successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Replace an entire conflict record (overwrite)
 * @route     PUT /conflicts/:id
 * @access    Private
 */
export const replaceConflict = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const conflict = await conflictService.updateConflict(id, req.body, true);
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record replaced successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Remove a conflict record
 * @route     DELETE /conflicts/:id
 * @access    Private (Admin-only preferred)
 */
export const deleteConflict = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const conflict = await conflictService.deleteConflict(id);
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict record deleted successfully.',
    conflict
  ).send(res);
});

// ==========================================
// 2. Analytical & Statistics Aggregations
// ==========================================

/**
 * @desc      Get general global statistics summary across all conflict records
 * @route     GET /conflicts/stats/overview
 * @access    Public
 */
export const getStatsOverview = asyncHandler(async (req, res) => {
  const stats = await conflictService.getConflictStatsOverview();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict stats overview fetched successfully.',
    stats
  ).send(res);
});

/**
 * @desc      Get conflict document with highest recorded inflation rate
 * @route     GET /conflicts/stats/highest-inflation
 * @access    Public
 */
export const getHighestInflationConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.getHighestInflation();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Highest inflation conflict fetched successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Get conflict document with lowest recorded GDP change (highest economic contraction)
 * @route     GET /conflicts/stats/lowest-gdp
 * @access    Public
 */
export const getLowestGDPConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.getLowestGDP();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Lowest GDP conflict (highest contraction) fetched successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Get conflict document with highest recorded war cost
 * @route     GET /conflicts/stats/highest-warcost
 * @access    Public
 */
export const getHighestWarCostConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.getHighestWarCost();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Highest war cost conflict fetched successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Get conflict document with highest recorded reconstruction cost
 * @route     GET /conflicts/stats/highest-reconstruction
 * @access    Public
 */
export const getHighestReconstructionCostConflict = asyncHandler(async (req, res) => {
  const conflict = await conflictService.getHighestReconstructionCost();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Highest reconstruction cost conflict fetched successfully.',
    conflict
  ).send(res);
});

/**
 * @desc      Get count of conflicts grouped by geographical region
 * @route     GET /conflicts/stats/region-distribution
 * @access    Public
 */
export const getRegionDistribution = asyncHandler(async (req, res) => {
  const data = await conflictService.getRegionDistribution();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Region distribution stats fetched successfully.',
    data
  ).send(res);
});

/**
 * @desc      Get count of conflicts grouped by category type
 * @route     GET /conflicts/stats/type-distribution
 * @access    Public
 */
export const getConflictTypeDistribution = asyncHandler(async (req, res) => {
  const data = await conflictService.getConflictTypeDistribution();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Conflict type distribution stats fetched successfully.',
    data
  ).send(res);
});

/**
 * @desc      Get financial costs (total, average) grouped by region
 * @route     GET /conflicts/stats/warcost-by-region
 * @access    Public
 */
export const getWarCostByRegion = asyncHandler(async (req, res) => {
  const data = await conflictService.getWarCostByRegion();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'War cost statistics by region fetched successfully.',
    data
  ).send(res);
});

/**
 * @desc      Get inflation rates (avg, min, max) grouped by region
 * @route     GET /conflicts/stats/inflation-by-region
 * @access    Public
 */
export const getInflationByRegion = asyncHandler(async (req, res) => {
  const data = await conflictService.getInflationByRegion();
  return new ApiResponse(
    HTTP_STATUS.OK,
    'Inflation statistics by region fetched successfully.',
    data
  ).send(res);
});

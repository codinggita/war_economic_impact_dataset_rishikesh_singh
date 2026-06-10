import express from 'express';
import {
  createConflict,
  getAllConflicts,
  getConflictById,
  updateConflict,
  replaceConflict,
  deleteConflict,
  getStatsOverview,
  getHighestInflationConflict,
  getLowestGDPConflict,
  getHighestWarCostConflict,
  getHighestReconstructionCostConflict,
  getRegionDistribution,
  getConflictTypeDistribution,
  getWarCostByRegion,
  getInflationByRegion
} from '../controllers/conflict.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { validateConflict } from '../validators/conflict.validator.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import { generalLimiter, searchLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

// ==========================================
// 1. Analytics & Statistics Routes
// (Must be defined BEFORE /:id to prevent route mapping collisions)
// ==========================================

router.get('/stats/overview', generalLimiter, getStatsOverview);
router.get('/stats/highest-inflation', getHighestInflationConflict);
router.get('/stats/lowest-gdp', getLowestGDPConflict);
router.get('/stats/highest-warcost', getHighestWarCostConflict);
router.get('/stats/highest-reconstruction', getHighestReconstructionCostConflict);
router.get('/stats/region-distribution', getRegionDistribution);
router.get('/stats/type-distribution', getConflictTypeDistribution);
router.get('/stats/warcost-by-region', getWarCostByRegion);
router.get('/stats/inflation-by-region', getInflationByRegion);

// ==========================================
// 2. Conflict CRUD & Search Routes
// ==========================================

// GET all conflicts (supports filtering, sorting, pagination, search)
router.get('/', searchLimiter, getAllConflicts);

// GET single conflict details
router.get('/:id', getConflictById);

// POST create a new conflict (Requires authentication)
router.post('/', protect, validateBody(validateConflict), createConflict);

// PUT replace an entire conflict record (Requires authentication)
router.put('/:id', protect, validateBody(validateConflict, true), replaceConflict);

// PATCH partially update an existing conflict record (Requires authentication)
router.patch('/:id', protect, validateBody(validateConflict, true), updateConflict);

// DELETE remove a conflict record (Requires authentication + Admin role authorization)
router.delete('/:id', protect, authorize('admin'), deleteConflict);

export default router;

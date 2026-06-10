import express from 'express';
import {
  createConflict,
  getAllConflicts,
  getConflictById,
  updateConflict,
  replaceConflict,
  deleteConflict,
} from '../controllers/conflict.controller.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public read routes, protected write routes
router.route('/')
  .post(protect, createConflict)
  .get(getAllConflicts);

// Public lookup route, protected patch, put, and delete routes
// Only admins are permitted to delete a record
router.route('/:id')
  .get(getConflictById)
  .patch(protect, updateConflict)
  .put(protect, replaceConflict)
  .delete(protect, authorize('admin'), deleteConflict);

export default router;

import express from 'express';
import {
  createConflict,
  getAllConflicts,
  getConflictById,
  updateConflict,
  replaceConflict,
  deleteConflict,
} from '../controllers/conflict.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { validateConflict } from '../validators/conflict.validator.js';
import { protect, authorize } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public read routes, protected write routes (Payload validated on create)
router.route('/')
  .post(protect, validateBody(validateConflict), createConflict)
  .get(getAllConflicts);

// Public lookup route, protected patch, put, and delete routes
// Only admins are permitted to delete a record. Payload validated on update/replace.
router.route('/:id')
  .get(getConflictById)
  .patch(protect, validateBody(validateConflict, true), updateConflict)
  .put(protect, validateBody(validateConflict, true), replaceConflict)
  .delete(protect, authorize('admin'), deleteConflict);

export default router;

import express from 'express';
import {
  createConflict,
  getAllConflicts,
  getConflictById,
  updateConflict,
  replaceConflict,
  deleteConflict,
} from '../controllers/conflict.controller.js';

const router = express.Router();

router.route('/')
  .post(createConflict)
  .get(getAllConflicts);

router.route('/:id')
  .get(getConflictById)
  .patch(updateConflict)
  .put(replaceConflict)
  .delete(deleteConflict);

export default router;

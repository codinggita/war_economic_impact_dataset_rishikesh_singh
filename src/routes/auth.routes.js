import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Protected Authentication Routes (Require Bearer JWT token verification)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;

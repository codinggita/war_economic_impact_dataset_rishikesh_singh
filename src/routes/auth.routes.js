import express from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validation.middleware.js';
import { validateRegister, validateLogin } from '../validators/auth.validator.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public Authentication Routes (Payload validated)
router.post('/register', validateBody(validateRegister), register);
router.post('/login', validateBody(validateLogin), login);

// Protected Authentication Routes (Require Bearer JWT token verification)
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;

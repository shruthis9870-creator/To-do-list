import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Public auth endpoints
router.post('/register', register);
router.post('/login', login);

// Authenticated auth endpoints
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;

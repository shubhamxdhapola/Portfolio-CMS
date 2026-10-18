import express from 'express';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import {
  login,
  logout,
  getMe,
  changePassword,
  updateProfile,
} from '../controllers/auth.controller.js';
import {
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
} from '../validations/auth.validation.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.get('/get-user-info', authenticate, getMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);
router.patch('/change-password', authenticate, validate(changePasswordSchema), changePassword);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);

export default router;
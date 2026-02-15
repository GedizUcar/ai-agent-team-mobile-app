import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/auth';
import { authRateLimiter, generalRateLimiter } from '../middlewares/rateLimiter';
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../validators/auth';

const authRouter = Router();

authRouter.post('/register', authRateLimiter, validate(registerSchema), authController.register);
authRouter.post('/login', authRateLimiter, validate(loginSchema), authController.login);
authRouter.post('/logout', authenticate, validate(refreshSchema), authController.logout);
authRouter.post('/refresh', validate(refreshSchema), authController.refresh);
authRouter.post('/forgot-password', authRateLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
authRouter.post('/reset-password', authRateLimiter, validate(resetPasswordSchema), authController.resetPassword);
authRouter.get('/me', authenticate, authController.getMe);
authRouter.put('/profile', authenticate, generalRateLimiter, validate(updateProfileSchema), authController.updateProfile);

export { authRouter };

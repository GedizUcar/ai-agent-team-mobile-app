import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../types/api';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  const result = await authService.register(
    { email, password, firstName, lastName },
    userAgent,
    ipAddress,
  );

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Registration successful',
  };

  res.status(201).json(response);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  const result = await authService.login({ email, password }, userAgent, ipAddress);

  const response: ApiResponse = {
    success: true,
    data: result,
    message: 'Login successful',
  };

  res.json(response);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);

  const response: ApiResponse = {
    success: true,
    message: 'Logged out successfully',
  };

  res.json(response);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  const tokens = await authService.refresh(refreshToken, userAgent, ipAddress);

  const response: ApiResponse = {
    success: true,
    data: tokens,
  };

  res.json(response);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);

  const response: ApiResponse = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent',
  };

  res.json(response);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);

  const response: ApiResponse = {
    success: true,
    message: 'Password reset successful',
  };

  res.json(response);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await authService.getMe(userId);

  const response: ApiResponse = {
    success: true,
    data: user,
  };

  res.json(response);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await authService.updateProfile(userId, req.body);

  const response: ApiResponse = {
    success: true,
    data: user,
    message: 'Profile updated successfully',
  };

  res.json(response);
});

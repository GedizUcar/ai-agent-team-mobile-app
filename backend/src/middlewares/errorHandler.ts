import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { ApiError, ErrorCode } from '../types/api';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response<ApiError>,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  logger.error('Unhandled error:', err);

  return res.status(500).json({
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
    },
  });
};

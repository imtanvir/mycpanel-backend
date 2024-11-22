import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';
import { TErrorSource } from '../../types';
import config from '../config';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleValidationError from '../errors/handleValidationError';
import handleZodError from '../errors/handleZodError';
import AppError from './AppError';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something Went Wrong!';

  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  if (err instanceof ZodError) {
    // ZodError
    const errorFormat = handleZodError(err);
    statusCode = errorFormat.statusCode;
    message = errorFormat.message;
    errorSource = errorFormat.errorSources;
  } else if (err.name === 'ValidationError') {
    // Mongoose ValidationError
    const errorFormat = handleValidationError(err);
    statusCode = errorFormat.statusCode;
    message = errorFormat.message;
    errorSource = errorFormat.errorSources;
  } else if (err?.name === 'CastError') {
    // Mongoose CastError
    const errorFormat = handleCastError(err);
    statusCode = errorFormat.statusCode;
    message = errorFormat.message;
    errorSource = errorFormat.errorSources;
  } else if (err?.code === 11000) {
    // MongoDB DuplicateKeyError
    const errorFormat = handleDuplicateError(err);
    statusCode = errorFormat.statusCode;
    message = errorFormat.message;
    errorSource = errorFormat.errorSources;
  } else if (err.name === 'TokenExpiredError') {
    // JWT TokenExpiredError
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Unauthorized. Token has expired.';
    errorSource = [
      {
        path: '',
        message: 'Token has expired.',
      },
    ];
  } else if (err instanceof jwt.JsonWebTokenError) {
    // JWT JsonWebTokenError
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Unauthorized. Token is invalid.';
    errorSource = [
      {
        path: '',
        message: 'Token is invalid.',
      },
    ];
  } else if (err instanceof AppError) {
    // Custom AppError
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    /* Generic Error */
    message = err.message;
    errorSource = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }
  // Send response
  return res.status(statusCode).json({
    success: false,
    message: message,
    errorSource,
    stack: config.node_env === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;

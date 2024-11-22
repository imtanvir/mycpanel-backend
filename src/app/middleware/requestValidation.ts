import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const requestValidation = (requestSchema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await requestSchema.parseAsync({
      body: req.body,
    });
    next();
  });
};

export default requestValidation;

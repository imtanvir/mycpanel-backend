import { Response } from 'express';
import { TResponse } from '../../types';

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
  res.status(responseData.statusCode as number).json({
    success: responseData.success,
    statusCode: responseData.statusCode,
    message: responseData.message,
    accessToken: responseData.accessToken,
    refreshToken: responseData.refreshToken,
    data: responseData.data,
  });
};

export default sendResponse;

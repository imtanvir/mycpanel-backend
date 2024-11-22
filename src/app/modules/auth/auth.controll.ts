import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { authService } from './auth.service';

const SignUp = catchAsync(async (req, res) => {
  const payload = req.body;
  if (req.files && req.files?.length === 0) {
    throw new Error('User Photo not provided!');
  }
  const result = await authService.SignUp(payload, req.files as Express.Multer.File[]);
  const authUserResponse = { ...result.toObject(), password: undefined };
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User registered successfully!',
    data: authUserResponse,
  });
});

const signIn = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.SignIn(email, password);
  const { jwtPayload, accessToken, refreshToken } = result;

  // send cookies to client with refresh token
  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    sameSite: 'none',
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully!',
    data: {
      jwtPayload,
      accessToken,
      refreshToken,
    },
  });
});
export const AuthController = {
  SignUp,
  signIn,
};

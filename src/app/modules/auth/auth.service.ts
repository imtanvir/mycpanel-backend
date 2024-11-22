import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../middleware/AppError';
import { createToken } from '../../utils/auth.utils';
import { sendImageToCloudinary } from '../../utils/uploadImageInCloudinary';
import { TImage } from '../user/user.interface';
import { UserModel } from '../user/user.model';
import { TAuth } from './auth.interface';

const SignUp = async (payload: TAuth, files: Express.Multer.File[]) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const isUserExist = await UserModel.isUserExist(payload.email);

    if (isUserExist) {
      throw new AppError(httpStatus.CONFLICT, 'User already exist!');
    }

    if (files) {
      const images: TImage[] = [];
      for (const file of files) {
        const imageName = `${Math.floor(Math.random() * 9000) + 100000}`;

        // send image to Cloudinary using buffer
        const { secure_url } = await sendImageToCloudinary(imageName, file.buffer);
        images.push({
          id: imageName,
          url: secure_url as string,
          isRemove: false,
        });
      }
      payload.image = images;
    }
    const result = await UserModel.create(payload);

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    if (error.code === 11000 && error.keyValue) {
      const duplicateKeys = Object.keys(error?.keyValue).join(', ');
      throw new AppError(httpStatus.CONFLICT, `User with this ${duplicateKeys} already exists`);
    }
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Something went wrong');
  }
};

const SignIn = async (email: string, password: string) => {
  const isUserExist = await UserModel.findOne({ email }).select('+password');
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const isPasswordMatched = await UserModel.isPasswordMatched(password, isUserExist.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password is incorrect!');
  }

  const jwtPayload: TAuth = {
    ...isUserExist.toObject(),
    password: '',
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    jwtPayload,
    accessToken,
    refreshToken,
  };
};
export const authService = {
  SignUp,
  SignIn,
};

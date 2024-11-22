import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserService } from './user.service';

const userProfile = catchAsync(async (req, res) => {
  const result = await UserService.userProfile(req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully!',
    data: result,
  });
});

const userUpdate = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payLoad = req.body;
  console.log({ payLoad, id });
  const imageFiles = Array.isArray(req?.files) && req.files !== undefined ? req.files : [];
  const result = await UserService.userUpdate(id, payLoad, imageFiles);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await UserService.getAllUser();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All user retrieved successfully!',
    data: result,
  });
});

const updateUserByAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payLoad = req.body;
  const imageFiles = Array.isArray(req?.files) && req.files !== undefined ? req.files : [];
  const result = await UserService.updateUserByAdmin(id, payLoad, imageFiles);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully!',
    data: result,
  });
});

const followUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { actionUserId } = req.body;
  const result = await UserService.followUser(id, actionUserId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User followed successfully!',
    data: result,
  });
});
export const UserController = {
  userProfile,
  userUpdate,
  getAllUser,
  updateUserByAdmin,
  followUser,
};

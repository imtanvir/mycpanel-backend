import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostService } from './post.service';

const createPost = catchAsync(async (req, res) => {
  const payload = req.body;

  if (req.files && req.files?.length === 0) {
    throw new Error('Post image not provided!');
  }
  const result = await PostService.createPost(payload, req.files as Express.Multer.File[]);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post created successfully!',
    data: result,
  });
});

const getAllPost = catchAsync(async (req, res) => {
  const limit = parseInt(req.query.limit as string) || 5;
  const skip = parseInt(req.query.skip as string) || 0;
  const search = (req.query.search as string) || '';

  const result = await PostService.getAllPost(limit, skip, search);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All post retrieved successfully!',
    data: result,
  });
});

const updatePostVote = catchAsync(async (req, res) => {
  const payload = req.body;
  const { postId, userId, action } = payload;
  const result = await PostService.updatePostVote(postId, userId, action);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post updated successfully!',
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const imageFiles = Array.isArray(req?.files) && req.files !== undefined ? req.files : [];
  const result = await PostService.updatePost(id, payload, imageFiles);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post updated successfully!',
    data: result,
  });
});

const commentOnPost = catchAsync(async (req, res) => {
  const payload = req.body;
  console.log({ payload });
  const { comment, userId } = payload;
  const { id: postId } = req.params;
  const result = await PostService.commentOnPost(postId, userId, comment);
  const { result: comments, allComments } = result;
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment attached successfully!',
    data: { comments, allComments },
  });
});

const updateCommentOnPost = catchAsync(async (req, res) => {
  const payload = req.body;
  const { comment, commentId } = payload;
  const { id } = req.params;
  const result = await PostService.updateCommentOnPost(id, commentId, comment);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment updated successfully!',
    data: result,
  });
});

const deleteCommentOnPost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { commentId, userId } = req.body;
  const result = await PostService.deleteCommentOnPost(id, commentId, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Comment deleted successfully!',
    data: result,
  });
});

const getUserPosts = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostService.getUserPosts(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User posts retrieved successfully!',
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostService.deletePost(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Post deleted successfully!',
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PostService.getSinglePost(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single post retrieved successfully!',
    data: result,
  });
});
export const PostController = {
  createPost,
  getAllPost,
  updatePostVote,
  updatePost,
  commentOnPost,
  updateCommentOnPost,
  deleteCommentOnPost,
  getUserPosts,
  deletePost,
  getSinglePost,
};

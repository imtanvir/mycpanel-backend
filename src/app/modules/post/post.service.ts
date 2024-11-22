import mongoose, { Types } from 'mongoose';
import {
  deleteImageFromCloudinary,
  sendImageToCloudinary,
} from '../../utils/uploadImageInCloudinary';
import { TImage } from '../user/user.interface';
import { TPost, TVotes } from './post.interface';
import { PostModel } from './post.model';

const createPost = async (payload: TPost, files: Express.Multer.File[]) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

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

    const post = await PostModel.create(payload);
    await session.commitTransaction();
    await session.endSession();
    return post;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const getAllPost = async (limit: number, skip: number, searchQuery: string) => {
  const query = searchQuery ? { post: { $regex: new RegExp(searchQuery, 'i') } } : {};

  const posts = await PostModel.find(query)
    .populate({ path: 'user', select: '_id name image email' })
    .populate({
      path: 'comments.author',
      select: '_id name image followers following',
    })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  return posts;
};

const updatePostVote = async (postId: string, userId: string, action: 'upvote' | 'downvote') => {
  const post = await PostModel.findById(postId);

  if (!post) {
    throw new Error('Post not found');
  }

  // Initialize the updateData object
  let updateData: any = {
    votes: post.votes || [], // Ensure votes is initialized
    upvote: post.upvote,
    downvote: post.downvote,
  };

  // Find the existing vote by the user
  const existingVote = updateData.votes.find(
    (vote: TVotes) => vote.userId.toString() === userId.toString(),
  );

  if (existingVote && existingVote?.voteType === action) {
    updateData.votes = updateData.votes.filter(
      (vote: TVotes) => vote.userId.toString() !== userId.toString(),
    );
    if (action === 'upvote') {
      updateData.upvote = updateData.upvote - 1;
    } else if (action === 'downvote') {
      updateData.downvote = updateData.downvote - 1;
    }
  } else {
    if (action === 'upvote') {
      if (existingVote) {
        if (existingVote.voteType === 'downvote') {
          // User is switching from downvote to upvote
          updateData.upvote += 1; // Increase upvotes
          updateData.downvote -= 1; // Decrease downvotes
          existingVote.voteType = 'upvote'; // Change vote type
        }
        // If the user is already upvoting, do nothing
      } else {
        // If the user has not voted yet, add a new upvote
        updateData.upvote += 1;
        updateData.votes.push({ userId: new Types.ObjectId(userId), voteType: 'upvote' });
      }
    } else if (action === 'downvote') {
      if (existingVote) {
        if (existingVote.voteType === 'upvote') {
          // User is switching from upvote to downvote
          updateData.downvote += 1; // Increase downvotes
          updateData.upvote -= 1; // Decrease upvotes
          existingVote.voteType = 'downvote'; // Change vote type
        }
        // If the user is already downvoting, do nothing
      } else {
        // If the user has not voted yet, add a new downvote
        updateData.downvote += 1;
        updateData.votes.push({ userId: new Types.ObjectId(userId), voteType: 'downvote' });
      }
    }
  }

  // Use findByIdAndUpdate to update the post in the database
  const result = await PostModel.findByIdAndUpdate(
    postId,
    {
      upvote: updateData.upvote,
      downvote: updateData.downvote,
      votes: updateData.votes,
    },
    { new: true },
  );

  return result;
};

const updatePost = async (_id: string, payload: Partial<TPost>, files: any[]) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const images: TImage[] = [];
    const isPostExist = await PostModel.findById({ _id });
    if (!isPostExist) {
      throw new Error('Post not found');
    }

    if (
      isPostExist?.image &&
      payload?.image &&
      payload.image !== undefined &&
      isPostExist?.image?.[0].isRemove !== payload?.image?.[0].isRemove
    ) {
      for (const img of payload.image) {
        await deleteImageFromCloudinary(img.id);
      }
    }

    if (files.length > 0) {
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

      payload.image = [...images];
    }

    const result = await PostModel.findByIdAndUpdate({ _id }, payload, {
      new: true,
      runValidators: true,
      session,
    });

    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const commentOnPost = async (_id: string, userId: string, comment: string) => {
  // Check if the provided _id and userId are valid ObjectIds
  console.log(_id, { userId }, Types.ObjectId.isValid(_id), Types.ObjectId.isValid(userId));
  if (!Types.ObjectId.isValid(_id)) {
    throw new Error('Invalid Post ID');
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid User ID');
  }

  const postObjectId = new Types.ObjectId(_id);
  const userObjectId = new Types.ObjectId(userId);

  // Check if the post exists
  const isPostExist = await PostModel.findById(postObjectId);
  if (!isPostExist) {
    throw new Error('Post does not exist!');
  }

  // Update the post by pushing the new comment
  const result = await PostModel.findByIdAndUpdate(
    postObjectId,
    {
      $push: {
        comments: {
          author: userObjectId,
          comment,
          postId: postObjectId,
        },
      },
    },
    { new: true },
  );
  const allComments = await PostModel.findById(postObjectId).populate({
    path: 'comments.author',
    select: '_id name image',
  });

  return {
    result,
    allComments,
  };
};

const updateCommentOnPost = async (_id: string, commentId: string, updatedComment: string) => {
  const isPostExist = await PostModel.findById({ _id });
  if (!isPostExist) {
    throw new Error('Post not found');
  }

  const result = await PostModel.findOneAndUpdate(
    { _id: new Types.ObjectId(_id), 'comments._id': new Types.ObjectId(commentId) },
    { $set: { 'comments.$.comment': updatedComment } },
    { new: true },
  );

  return result;
};

const deleteCommentOnPost = async (_id: string, commentId: string, userId: string) => {
  const isPostExist = await PostModel.findById({ _id });
  if (!isPostExist) {
    throw new Error('Post not found');
  }
  const updatedPost = await PostModel.findOneAndUpdate(
    { _id: new Types.ObjectId(_id) },
    {
      $pull: {
        comments: {
          _id: new Types.ObjectId(commentId),
          author: new Types.ObjectId(userId),
        },
      },
    },
    { new: true },
  );

  return updatedPost;
};

const getUserPosts = async (userId: string) => {
  const result = await PostModel.find({ user: new Types.ObjectId(userId) })
    .populate({ path: 'user', select: '_id name image email' })
    .populate({
      path: 'comments.author',
      select: '_id name image',
    })
    .sort({ createdAt: -1 });
  return result;
};

const deletePost = async (_id: string) => {
  const isPostExist = await PostModel.findById({ _id });
  if (!isPostExist) {
    throw new Error('Post not found');
  }
  const result = await PostModel.findByIdAndDelete({ _id }, { new: true });
  return null;
};

const getSinglePost = async (_id: string) => {
  const result = await PostModel.findById({ _id })
    .populate({ path: 'user', select: '_id name image email' })
    .populate({
      path: 'comments.author',
      select: '_id name image',
    })
    .sort({ createdAt: -1 });

  if (!result) {
    throw new Error('Post not found');
  }
  return result;
};
export const PostService = {
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

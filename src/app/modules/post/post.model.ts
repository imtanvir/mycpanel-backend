import { model, Schema } from 'mongoose';
import { TPost } from './post.interface';

const postSchema = new Schema<TPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    premium: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    image: {
      type: [
        {
          _id: false,
          id: { type: String, required: true },
          url: { type: String, required: true },
          isRemove: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    category: {
      type: String,
      enum: ['tip', 'story'],
      default: 'story',
    },
    upvote: {
      type: Number,
      default: 0,
    },
    downvote: {
      type: Number,
      default: 0,
    },
    post: {
      type: String,
      required: true,
    },
    votes: {
      type: [
        {
          userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
          voteType: {
            type: String,
            enum: ['upvote', 'downvote'],
            required: true,
          },
        },
      ],
      default: [],
    },
    comments: {
      type: [
        {
          author: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
          },
          comment: {
            type: String,
            required: true,
          },
        },
      ],
      ref: 'comment',
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
postSchema.index({ post: 'text' });

export const PostModel = model<TPost>('post', postSchema);

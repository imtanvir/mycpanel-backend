import express, { NextFunction, Request, Response } from 'express';
import authCheck from '../../middleware/authCheck';
import requestValidation from '../../middleware/requestValidation';
import { upload } from '../../utils/uploadImageInCloudinary';
import { USER_ROLE } from '../user/user.constant';
import { PostController } from './post.controll';
import { postValidation } from './post.validation';

const router = express.Router();
router.post(
  '/create-post',
  authCheck(USER_ROLE.user),
  upload.array('file', 1),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('here:', req.body);
      req.body = JSON.parse(req.body.data);
      console.log(req.body);
      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  requestValidation(postValidation.postCheck),
  PostController.createPost,
);

router.get(
  '/all-post',
  // authCheck(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  PostController.getAllPost,
);

router.get('/single-post/:id', PostController.getSinglePost);

router.put('/update-post/vote', authCheck(USER_ROLE.user), PostController.updatePostVote);
router.delete(
  '/delete-post/:id',
  authCheck(USER_ROLE.user, USER_ROLE.admin),
  PostController.deletePost,
);
router.put(
  '/update-post/:id',
  authCheck(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.array('file', 1),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  PostController.updatePost,
);

router.get(
  '/user-posts/:id',
  authCheck(USER_ROLE.user, USER_ROLE.admin),
  PostController.getUserPosts,
);
router.post('/comment-on-post/:id', authCheck(USER_ROLE.user), PostController.commentOnPost);
router.put(
  '/update-comment-on-post/:id',
  authCheck(USER_ROLE.user),
  PostController.updateCommentOnPost,
);

router.delete(
  '/delete-comment-on-post/:id',
  authCheck(USER_ROLE.user),
  PostController.deleteCommentOnPost,
);

export const PostRoute = router;

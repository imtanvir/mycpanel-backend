import express, { NextFunction, Request, Response } from 'express';
import authCheck from '../../middleware/authCheck';
import requestValidation from '../../middleware/requestValidation';
import { upload } from '../../utils/uploadImageInCloudinary';
import { USER_ROLE } from './user.constant';
import { UserController } from './user.controll';
import { userValidation } from './user.validation';
const router = express.Router();

router.get('/', authCheck(USER_ROLE.user, USER_ROLE.admin), UserController.userProfile);

router.put(
  '/update/:id',
  authCheck(USER_ROLE.user, USER_ROLE.admin),
  upload.array('file', 1),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('hit', req.body);
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  requestValidation(userValidation.profileUpdateValidation),
  UserController.userUpdate,
);

router.get('/all', authCheck(USER_ROLE.superAdmin, USER_ROLE.admin), UserController.getAllUser);
router.put('/follow-user/:id', authCheck(USER_ROLE.user), UserController.followUser);
router.put(
  '/update-user/:id',
  authCheck(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.array('file', 1),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data);
      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  requestValidation(userValidation.userProfileValidation),
  UserController.updateUserByAdmin,
);

export const UserRoute = router;

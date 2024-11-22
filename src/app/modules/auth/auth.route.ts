import express, { NextFunction, Request, Response } from 'express';
import requestValidation from '../../middleware/requestValidation';
import { upload } from '../../utils/uploadImageInCloudinary';
import { AuthController } from './auth.controll';
import { authValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/signup',
  upload.array('file', 1),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body.data);
      req.body = JSON.parse(req.body.data);
      console.log(req.body);
      next();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
  requestValidation(authValidation.signUpValidation),
  AuthController.SignUp,
);
router.post('/signin', requestValidation(authValidation.signInValidation), AuthController.signIn);

export const AuthRoute = router;

import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  refreshTokensController,
  logoutUserController,
} from '../controllers/authControllers.js';
import {
  registerUserSchema,
  loginUserSchema,
  refreshTokenSchema,
} from '../validation/authValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post(
  '/register',
  upload.single('avatar'),
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post(
  '/refresh',
  validateBody(refreshTokenSchema),
  ctrlWrapper(refreshTokensController),
);

router.post('/logout', authenticate, ctrlWrapper(logoutUserController));

export default router;

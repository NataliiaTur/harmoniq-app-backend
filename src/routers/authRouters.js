import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerUserController,
  loginUserController,
  refreshTokensController,
} from '../controllers/authControllers.js';
import {
  registerUserSchema,
  loginUserSchema,
  refreshTokenSchema,
} from '../validation/authValidation.js';

const router = express.Router();

router.post(
  '/register',
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

export default router;

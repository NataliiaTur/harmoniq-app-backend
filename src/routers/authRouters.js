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
import { auth } from '../middlewares/authenticate.js';

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

router.post('/logout', auth, ctrlWrapper(logoutUserController));

export default router;

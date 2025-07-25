import express from 'express';
import { registerUserController } from '../controllers/authControllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema } from '../validation/authValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserController } from '../controllers/authControllers.js';
import { loginUserSchema } from '../validation/authValidation.js';

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

export default router;

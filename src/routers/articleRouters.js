import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createArticleController,
  getArticleByIdController,
  getArticlesController,
} from '../controllers/articleControllers.js';
import { createArticleSchema } from '../validation/articleValidation.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getArticlesController));
router.get('/:articleId', isValidId, ctrlWrapper(getArticleByIdController));
router.post(
  '/',
  validateBody(createArticleSchema),
  ctrlWrapper(createArticleController),
);

export default router;

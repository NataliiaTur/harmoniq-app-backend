import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createArticleController,
  deleteArticleController,
  getArticleByIdController,
  getArticlesController,
  patchArticleController,
} from '../controllers/articleControllers.js';
import { createArticleSchema } from '../validation/articleValidation.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidArticleId } from '../middlewares/isValidId.js';

const router = Router();

router.get('/', ctrlWrapper(getArticlesController));
router.get(
  '/:articleId',
  isValidArticleId,
  ctrlWrapper(getArticleByIdController),
);
router.post(
  '/',
  validateBody(createArticleSchema),
  ctrlWrapper(createArticleController),
);
router.patch(
  '/:articleId',
  isValidArticleId,
  ctrlWrapper(patchArticleController),
);
router.delete(
  '/:articleId',
  isValidArticleId,
  ctrlWrapper(deleteArticleController),
);

export default router;

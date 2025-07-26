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
import { authenticate } from '../middlewares/authenticate.js';

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
  authenticate,
  ctrlWrapper(createArticleController),
);
router.patch(
  '/:articleId',
  isValidArticleId,
  authenticate,
  ctrlWrapper(patchArticleController),
);
router.delete(
  '/:articleId',
  isValidArticleId,
  authenticate,
  ctrlWrapper(deleteArticleController),
);

export default router;

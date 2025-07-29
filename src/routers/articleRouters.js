import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createArticleController,
  deleteArticleController,
  getArticleByIdController,
  getArticlesController,
  getArticlesByOwnerIdController,
  patchArticleController,
} from '../controllers/articleControllers.js';
import {
  createArticleSchema,
  updateArticleSchema,
} from '../validation/articleValidation.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidArticleId, isValidOwnerId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.get('/', ctrlWrapper(getArticlesController));
router.get(
  '/:articleId',
  isValidArticleId,
  ctrlWrapper(getArticleByIdController),
);
router.post(
  '/',
  upload.single('img'),
  validateBody(createArticleSchema),
  authenticate,
  ctrlWrapper(createArticleController),
);
router.patch(
  '/:articleId',
  upload.single('img'),
  isValidArticleId,
  validateBody(updateArticleSchema),
  authenticate,
  ctrlWrapper(patchArticleController),
);
router.delete(
  '/:articleId',
  isValidArticleId,
  authenticate,
  ctrlWrapper(deleteArticleController),
);

router.get(
  '/owner/:ownerId',
  isValidOwnerId,
  ctrlWrapper(getArticlesByOwnerIdController),
);

export default router;

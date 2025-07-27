import { Router } from 'express';
import {
  getUserById,
  getSavedArticles,
} from '../controllers/userControllers.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  getCreatedArticles,
  saveArticle,
  removeSavedArticle,
} from '../controllers/userControllers.js';
import { getAllUsers } from '../controllers/userControllers.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidArticleId } from '../middlewares/isValidId.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getCurrentUserController } from '../controllers/userControllers.js';
import { updatedUserAvatar } from '../controllers/userControllers.js';
import { updateUserInfo } from '../controllers/userControllers.js';
import { upload } from '../middlewares/multer.js';
import { userUpdateInfoSchema } from '../validation/userValidation.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.get('/saved-articles', authenticate, ctrlWrapper(getSavedArticles));

router.get('/created-articles', authenticate, ctrlWrapper(getCreatedArticles));

router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.post(
  '/save/:articleId',
  authenticate,
  isValidArticleId,
  ctrlWrapper(saveArticle),
);

router.delete(
  '/save/:articleId',
  authenticate,
  isValidArticleId,
  ctrlWrapper(removeSavedArticle),
);

router.get('/', ctrlWrapper(getAllUsers));

router.get('/:id', isValidId, ctrlWrapper(getUserById));

router.patch(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  ctrlWrapper(updatedUserAvatar),
);

router.patch(
  '/info',
  authenticate,
  validateBody(userUpdateInfoSchema),
  ctrlWrapper(updateUserInfo),
);

export default router;

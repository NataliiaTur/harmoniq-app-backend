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
import { uploadUserPhoto } from '../controllers/userControllers.js';
import { upload } from '../middlewares/multer.js';
import { getCurrentUserController } from '../controllers/userControllers.js';

const router = Router();

router.get('/saved-articles', authenticate, ctrlWrapper(getSavedArticles));
router.get('/created-articles', authenticate, ctrlWrapper(getCreatedArticles));
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
router.get('/current', authenticate, ctrlWrapper(getCurrentUserController));

router.post(
  '/photo',
  authenticate,
  upload.single('photo'),
  ctrlWrapper(uploadUserPhoto),
);

router.patch(
  '/photo',
  authenticate,
  upload.single('photo'),
  ctrlWrapper(uploadUserPhoto),
);

export default router;

import { Router } from 'express';
import {
  getUserById,
  getSavedArticles,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getCreatedArticles,
  saveArticle,
  removeSavedArticle,
  getAllUsers,
  getCurrentUserController,
  // updatedUserAvatar,
  updateUserInfo,
  deleteUser,
} from '../controllers/userControllers.js';
import { isValidId, isValidArticleId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
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
  '/info',
  authenticate,
  upload.single('avatar'),
  validateBody(userUpdateInfoSchema),
  ctrlWrapper(updateUserInfo),
);

router.patch('/follow/:targetUserId', authenticate, ctrlWrapper(followUser));

router.patch(
  '/unfollow/:targetUserId',
  authenticate,
  ctrlWrapper(unfollowUser),
);

router.get('/followers/:userId', authenticate, ctrlWrapper(getFollowers));

router.get('/following/:userId', authenticate, ctrlWrapper(getFollowing));

router.delete('/current', authenticate, ctrlWrapper(deleteUser));

export default router;

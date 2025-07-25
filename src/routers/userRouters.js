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

const router = Router();

router.get('/saved-articles', getSavedArticles);
router.get('/created-articles', getCreatedArticles);
router.post('/save/:articleId', saveArticle);
router.delete('/save/:articleId', removeSavedArticle);
router.get('/', getAllUsers);
router.get('/:id', isValidId, getUserById);

export default router;

import { Router } from 'express';
import { getUserById, getSavedArticles } from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { getCreatedArticles } from '../controllers/users.js';
import { saveArticle } from '../controllers/users.js';
import { removeSavedArticle } from '../controllers/users.js';

const router = Router();

router.get('/:id', isValidId, getUserById);
router.get('/saved-articles', authenticate, getSavedArticles);
router.get('/created-articles', authenticate, getCreatedArticles);
router.post('/save/:articleId', authenticate, saveArticle);
router.delete('/save/:articleId', authenticate, removeSavedArticle);
export default router;

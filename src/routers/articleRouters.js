import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createArticleController,
  getArticleByIdController,
  getArticlesController,
} from '../controllers/articleControllers.js';

const router = Router();

router.get('/articles', ctrlWrapper(getArticlesController));
router.get('/articles/:articleId', ctrlWrapper(getArticleByIdController));
router.post('/articles', ctrlWrapper(createArticleController));

export default router;

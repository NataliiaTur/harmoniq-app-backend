import createHttpError from 'http-errors';
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  patchArticle,
} from '../services/articles.js';

export const getArticlesController = async (req, res) => {
  const articles = await getAllArticles();

  res.json({
    status: 200,
    message: 'Successfully found articles!',
    data: articles,
  });
};

export const getArticleByIdController = async (req, res, next) => {
  const { articleId } = req.params;
  const article = await getArticleById(articleId);

  if (!article) {
    return next(createHttpError(404, 'Article not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found article with id ${articleId}!`,
    data: article,
  });
};

export const createArticleController = async (req, res) => {
  const article = await createArticle(req.body, req.user.id);

  res.status(201).json({
    status: 201,
    message: 'Successfully created article',
    data: article,
  });
};

export const patchArticleController = async (req, res, next) => {
  const { articleId } = req.params;
  const updatedArticle = await patchArticle(articleId, req.body);

  if (!updatedArticle) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully patched an article',
    data: updatedArticle,
  });
};

export const deleteArticleController = async (req, res, next) => {
  const { articleId } = req.params;
  const deletedArticle = await deleteArticle(articleId);

  if (!deletedArticle) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};

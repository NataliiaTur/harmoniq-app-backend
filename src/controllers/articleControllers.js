import {
  createArticle,
  getAllArticles,
  getArticleById,
} from '../services/articles.js';

export const getArticlesController = async (req, res) => {
  const articles = await getAllArticles();

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: articles,
  });
};

export const getArticleByIdController = async (req, res) => {
  const { articleId } = req.params;
  const article = await getArticleById(articleId);

  if (!article) {
    res.json({
      status: 404,
      message: 'Article not found',
    });
    return;
  }

  res.json({
    status: 200,
    message: `Successfully found article with id ${articleId}!`,
    data: article,
  });
};

export const createArticleController = async (req, res) => {
  const article = await createArticle(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created article',
    data: article,
  });
};

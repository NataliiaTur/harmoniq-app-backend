import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  patchArticle,
  getArticlesByOwnerId,
} from '../services/articles.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getArticlesController = async (req, res) => {
  const { filter, limit, ownerId } = req.query;
  const articles = await getAllArticles(filter, limit, ownerId);
  res.json({
    status: 200,
    message: 'Successfully found articles!',
    data: articles,
  });
};

export const getArticleByIdController = async (req, res) => {
  const { articleId } = req.params;
  const article = await getArticleById(articleId);
  res.json({
    status: 200,
    message: `Successfully found article with id ${articleId}!`,
    data: article,
  });
};

export const createArticleController = async (req, res) => {
  const photo = req.file;
  let photoUrl = null;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }
  const newArticle = await createArticle(
    { ...req.body, img: photoUrl },
    req.user.id,
    req.user.name,
  );
  res.status(201).json({
    status: 201,
    message: 'Successfully created article',
    data: newArticle,
  });
};

export const patchArticleController = async (req, res) => {
  const { articleId } = req.params;
  const photo = req.file;
  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }
  const result = await patchArticle(articleId, {
    ...req.body,
    img: photoUrl,
  });
  res.json({
    status: 200,
    message: 'Successfully patched an article',
    data: result,
  });
};

export const deleteArticleController = async (req, res) => {
  const { articleId } = req.params;
  await deleteArticle(articleId);
  res.status(204).send();
};

export const getArticlesByOwnerIdController = async (req, res) => {
  const { ownerId } = req.params;
  const articles = await getArticlesByOwnerId(ownerId);
  res.json({
    status: 200,
    message: 'Successfully found articles by owner id',
    data: articles,
  });
};

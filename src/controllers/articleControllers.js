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
  const { filter = 'all', limit, page, ownerId } = req.query;

  const shouldPaginate = limit !== undefined && page !== undefined;

  if (shouldPaginate) {
    const limitNum = Number(limit);
    const pageNum = Number(page);
    const skip = (pageNum - 1) * limitNum;

    const { data, total } = await getAllArticles(
      filter,
      limitNum,
      skip,
      ownerId,
    );

    return res.json({
      status: 200,
      message: 'Successfully found paginated articles!',
      data,
      total,
    });
  }

  const { data } = await getAllArticles(filter, limit, null, ownerId);

  return res.json({
    status: 200,
    message: 'Successfully found articles!',
    data,
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

import createHttpError from 'http-errors';
import { ArticlesCollection } from '../db/models/article.js';
import { UserCollection } from '../db/models/user.js';

export const getAllArticles = async (
  filter,
  limit = null,
  skip = null,
  ownerId = null,
) => {
  const query = {};

  if (filter === 'popular') {
    query.rate = { $gt: 0 };
  }

  if (ownerId) {
    query.ownerId = ownerId;
  }

  if (limit === null && skip === null) {
    const articles = await ArticlesCollection.find(query);
    return { data: articles };
  }

  const [articles, total] = await Promise.all([
    ArticlesCollection.find(query).skip(skip).limit(limit),
    ArticlesCollection.countDocuments(query),
  ]);

  return {
    data: articles,
    total,
  };
};

export const getArticleById = async (articleId) => {
  const article = await ArticlesCollection.findById(articleId);
  if (!article) {
    throw createHttpError(404, 'Article not found');
  }
  return article;
};
export const createArticle = async (payload, userId, name) => {
  const article = await ArticlesCollection.create({
    ...payload,
    ownerId: userId,
    ownerName: name,
  });
  const user = await UserCollection.findById(userId);
  user.articlesAmount += 1;
  await user.save();
  return article;
};

export const patchArticle = async (articleId, payload) => {
  const updatedArticle = await ArticlesCollection.findByIdAndUpdate(
    articleId,
    payload,
    { new: true },
  );
  if (!updatedArticle) {
    throw createHttpError(404, 'Article not found');
  }
  return updatedArticle;
};

export const deleteArticle = async (articleId) => {
  const article = await ArticlesCollection.findOneAndDelete(articleId);
  if (!article) {
    throw createHttpError(404, 'Article not found');
  }
  return article;
};

export const getArticlesByOwnerId = async (ownerId) => {
  const articles = await ArticlesCollection.find({ ownerId });
  if (!articles) {
    throw createHttpError(404, 'Articles not found');
  }
  return articles;
};

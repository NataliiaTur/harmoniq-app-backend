import createHttpError from 'http-errors';
import { ArticlesCollection } from '../db/models/article.js';
import { UserCollection } from '../db/models/user.js';

export const getAllArticles = async (filter, limit, ownerId) => {
  const query = {};
  if (ownerId) {
    query.ownerId = ownerId;
  }
  let articles = ArticlesCollection.find(query);
  if (filter === 'popular') {
    articles = articles.sort({ rate: -1 });
  }
  if (limit && !isNaN(Number(limit))) {
    articles = articles.limit(Number(limit));
  }
  return await articles;
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

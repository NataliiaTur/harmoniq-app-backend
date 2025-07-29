import createHttpError from 'http-errors';
import { ArticlesCollection } from '../db/models/article.js';

export const getAllArticles = async () => {
  const articles = await ArticlesCollection.find();
  return articles;
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

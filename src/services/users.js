import { UserCollection } from '../db/models/user.js';
import { ArticlesCollection } from '../db/models/article.js';
import createError from 'http-errors';

/**
 * Отримати всіх користувачів без паролів
 */
export const getAllUsersService = async () => {
  return await UserCollection.find({}, '_id name email');
};

/**
 * Отримати користувача по ID
 * @param {string} id
 */
export const getUserByIdService = async (id) => {
  const user = await UserCollection.findById(id).select('name email avatarURL');
  if (!user) {
    throw createError(404, 'User not found');
  }
  return user;
};

/**
 * Отримати збережені статті користувача
 * @param {string} userId
 */
export const getSavedArticlesService = async (userId) => {
  const user = await UserCollection.findById(userId).populate({
    path: 'savedArticles',
    select: 'title description photo author createdAt',
    populate: {
      path: 'author',
      select: 'name avatarURL',
    },
  });

  if (!user) {
    throw createError(404, 'User not found');
  }

  return user.savedArticles;
};

/**
 * Отримати створені користувачем статті
 * @param {string} userId
 */
export const getCreatedArticlesService = async (userId) => {
  return await ArticlesCollection.find({ author: userId });
};

/**
 * Зберегти статтю до списку користувача
 * @param {string} userId
 * @param {string} articleId
 */
export const saveArticleService = async (userId, articleId) => {
  const article = await ArticlesCollection.findById(articleId);
  if (!article) {
    throw createError(404, 'Article not found');
  }

  const user = await UserCollection.findById(userId);

  if (user.savedArticles.includes(articleId)) {
    throw createError(409, 'Article already saved');
  }

  user.savedArticles.push(articleId);
  await user.save();

  return user.savedArticles;
};

/**
 * Видалити збережену статтю зі списку користувача
 * @param {string} userId
 * @param {string} articleId
 */
export const removeSavedArticleService = async (userId, articleId) => {
  const user = await UserCollection.findById(userId);
  const index = user.savedArticles.indexOf(articleId);

  if (index === -1) {
    throw createError(404, 'Article not found in saved list');
  }

  user.savedArticles.splice(index, 1);
  await user.save();

  return user.savedArticles;
};

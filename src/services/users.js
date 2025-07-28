import { UserCollection } from '../db/models/user.js';
import { ArticlesCollection } from '../db/models/article.js';
import createError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

const recalculateArticleRate = async (articleId) => {
  const count = await UserCollection.countDocuments({
    savedArticles: articleId,
  });
  await ArticlesCollection.findByIdAndUpdate(articleId, {
    rate: count,
  });
};

export const getAllUsersService = async () => {
  return await UserCollection.find({});
};

export const getUserByIdService = async (id) => {
  const user = await UserCollection.findById(id);
  if (!user) {
    throw createError(404, 'User not found');
  }
  return user;
};

export const getSavedArticlesService = async (userId) => {
  const user = await UserCollection.findById(userId).populate('savedArticles');
  if (!user) {
    throw createError(404, 'User not found');
  }
  return user.savedArticles;
};
export const getCreatedArticlesService = async (userId) => {
  return await ArticlesCollection.find({ ownerId: userId });
};

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
  await recalculateArticleRate(articleId);
  return user.savedArticles;
};

export const removeSavedArticleService = async (userId, articleId) => {
  const user = await UserCollection.findById(userId);
  const index = user.savedArticles.indexOf(articleId);
  if (index === -1) {
    throw createError(404, 'Article not found in saved list');
  }
  user.savedArticles.splice(index, 1);
  await user.save();
  await recalculateArticleRate(articleId);
  return user.savedArticles;
};

export const updateUserPhotoService = async (userId, file) => {
  const user = await UserCollection.findById(userId);
  if (!user) throw createError(404, 'User not found');
  const avatarURL = await saveFileToCloudinary(file);
  user.avatar = avatarURL;
  await user.save();
  return user;
};

export const updateUserInfoService = async (userId, info) => {
  const user = await UserCollection.findById(userId);
  if (!user) throw createError(404, 'User not found');
  if (info.name) user.name = info.name;
  if (info.email) user.email = info.email;
  await user.save();
  return user;
};

export const currentUserService = async (userId) => {
  const user = await UserCollection.findById(userId).select('-password');
  if (!user) throw createError(404, 'User not found');
  return user;
};

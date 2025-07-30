import asyncHandler from 'express-async-handler';
import {
  getAllUsersService,
  getUserByIdService,
  getSavedArticlesService,
  getCreatedArticlesService,
  saveArticleService,
  removeSavedArticleService,
  updateUserInfoService,
  currentUserService,
} from '../services/users.js';

import { UserCollection } from '../db/models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

const clearTokens = (user) => {
  const copy = { ...user._doc };
  delete copy.accessToken;
  delete copy.refreshToken;
  delete copy.password;
  return copy;
};

export const getAllUsers = asyncHandler(async (req, res) => {
  const { filter, limit } = req.query;
  const users = await getAllUsersService(filter, limit);
  res.json({
    status: 'success',
    message: 'Users fetched successfully',
    data: users,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  res.json({
    status: 'success',
    message: 'User fetched successfully',
    data: user,
  });
});

export const getSavedArticles = asyncHandler(async (req, res) => {
  const saved = await getSavedArticlesService(req.user.id);
  res.json({
    status: 'success',
    message: 'Saved articles fetched successfully',
    data: saved,
  });
});

export const getCreatedArticles = asyncHandler(async (req, res) => {
  const created = await getCreatedArticlesService(req.user.id);
  res.json({
    status: 'success',
    message: 'Created articles fetched successfully',
    data: created,
  });
});

export const saveArticle = asyncHandler(async (req, res) => {
  const saved = await saveArticleService(req.user.id, req.params.articleId);
  res.json({
    status: 'success',
    message: 'Article saved successfully',
    data: saved,
  });
});

export const removeSavedArticle = asyncHandler(async (req, res) => {
  const updated = await removeSavedArticleService(
    req.user.id,
    req.params.articleId,
  );
  res.json({
    status: 'success',
    message: 'Article removed from saved list',
    data: updated,
  });
});

export const updatedUserAvatar = async (req, res) => {
  const avatar = req.file;
  let avatarURL = '';

  if (avatar) {
    avatarURL = await saveFileToCloudinary(avatar);
  }
  const newUser = await UserCollection.findByIdAndUpdate(
    req.user.id,
    { avatar: avatarURL },
    { new: true },
  );

  res.json({
    status: 'success',
    message: 'User updated successfully',
    data: clearTokens(newUser),
  });
};

export const getCurrentUserController = async (req, res) => {
  const user = await currentUserService(req.user.id);
  const response = clearTokens(user);
  res.json({
    status: 200,
    message: 'Current user fetched successfully',
    data: {
      user: response,
    },
  });
};

export const updateUserInfo = async (req, res) => {
  const info = req.body;
  const newUser = await updateUserInfoService(req.user.id, info);
  res.json({
    status: 'success',
    message: 'User updated successfully',
    data: clearTokens(newUser),
  });
};

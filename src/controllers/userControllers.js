import asyncHandler from 'express-async-handler';
import {
  getAllUsersService,
  getUserByIdService,
  getSavedArticlesService,
  getCreatedArticlesService,
  saveArticleService,
  removeSavedArticleService,
} from '../services/users.js';

import { ArticlesCollection } from '../db/models/article.js';
import { UserCollection } from '../db/models/user.js';
import fs from 'fs/promises';
import { cloudinary } from '../services/cloudinary.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  res.json({
    status: 'success',
    message: 'Users fetched successfully',
    data: users,
  });
});

/**
 * GET /api/users/:id
 * Отримати користувача по ID
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  res.json({
    status: 'success',
    message: 'User fetched successfully',
    data: user,
  });
});

/**
 * GET /api/users/saved
 * Отримати збережені статті авторизованого користувача
 */
export const getSavedArticles = asyncHandler(async (req, res) => {
  const saved = await getSavedArticlesService(req.user.id);
  res.json({
    status: 'success',
    message: 'Saved articles fetched successfully',
    data: saved,
  });
});

/**
 * GET /api/users/created
 * Отримати створені статті авторизованого користувача
 */
export const getCreatedArticles = asyncHandler(async (req, res) => {
  const created = await getCreatedArticlesService(req.user.id);
  res.json({
    status: 'success',
    message: 'Created articles fetched successfully',
    data: created,
  });
});

/**
 * POST /api/users/save/:articleId
 * Зберегти статтю користувачем
 */
export const saveArticle = asyncHandler(async (req, res) => {
  const saved = await saveArticleService(req.user.id, req.params.articleId);
  res.json({
    status: 'success',
    message: 'Article saved successfully',
    data: saved,
  });
});

/**
 * DELETE /api/users/remove/:articleId
 * Видалити статтю зі збережених
 */
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

export const uploadUserPhoto = async (req, res) => {
  const { path: tempPath } = req.file;
  const userId = req.user.id;

  try {
    const cloudResult = await cloudinary.uploader.upload(tempPath, {
      folder: 'avatars',
      public_id: `user_${userId}_${Date.now()}`,
    });

    const updatedUser = await UserCollection.findByIdAndUpdate(
      userId,
      { avatar: cloudResult.secure_url },
      { new: true },
    );

    res.status(200).json({
      status: 'success',
      message: 'Photo uploaded successfully',
      data: { avatar: updatedUser.avatar },
    });
  } catch {
    res.status(500).json({
      status: 'error',
      message: 'Failed to upload photo',
    });
  } finally {
    await fs.unlink(tempPath);
  }
};

export const getCurrentUserController = async (req, res) => {
  const user = req.user;

  res.json({
    status: 200,
    message: 'Current user fetched successfully',
    data: {
      user,
    },
  });
};

export const testArticlesOwners = async () => {
  const articles = await ArticlesCollection.find().limit(5);
  console.log(articles.map((a) => ({ id: a._id, ownerId: a.ownerId })));
};

import { User } from '../models/User.js';
import { Article } from '../models/Article.js';
import createError from 'http-errors';

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('name email avatarURL');

    if (!user) {
      throw createError(404, 'User not found');
    }

    res.json({
      status: 'success',
      code: 200,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSavedArticles = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate({
      path: 'savedArticles',
      select: 'title description photo author createdAt',
      populate: {
        path: 'author',
        select: 'name avatarURL',
      },
    });

    res.json({
      status: 'success',
      code: 200,
      data: {
        savedArticles: user.savedArticles,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCreatedArticles = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const articles = await Article.find({ author: userId });

    res.json({
      status: 'success',
      code: 200,
      data: {
        createdArticles: articles,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const saveArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;

    const article = await Article.findById(articleId);
    if (!article) {
      throw createError(404, 'Article not found');
    }

    const user = await User.findById(userId);

    if (user.savedArticles.includes(articleId)) {
      throw createError(409, 'Article already saved');
    }

    user.savedArticles.push(articleId);
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Article saved successfully',
      data: {
        savedArticles: user.savedArticles,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const removeSavedArticle = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    const index = user.savedArticles.indexOf(articleId);
    if (index === -1) {
      throw createError(404, 'Article not found in saved list');
    }

    user.savedArticles.splice(index, 1);
    await user.save();

    res.json({
      status: 'success',
      message: 'Article removed from saved list',
      data: {
        savedArticles: user.savedArticles,
      },
    });
  } catch (error) {
    next(error);
  }
};

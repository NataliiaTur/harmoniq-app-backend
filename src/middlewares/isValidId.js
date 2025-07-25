import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw createHttpError(400, `${id} is not a valid id`);
  }
  next();
};

export const isValidArticleId = (req, res, next) => {
  const { articleId } = req.params;
  if (!isValidObjectId(articleId)) {
    throw createHttpError(400, `${articleId} is not a valid id`);
  }
  next();
};

import { verifyAccessToken } from '../utils/token.js';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw createHttpError(401, 'Not authorized');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await UserCollection.findById(decoded.id);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    next(createHttpError(401, 'Invalid or expired token'));
  }
};

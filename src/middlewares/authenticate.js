import createHttpError from 'http-errors';
import { verifyAccessToken } from '../utils/token.js';
import { UserCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createHttpError(401, 'Not authorized (no token)');
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyAccessToken(token);
    const user = await UserCollection.findById(payload.id);

    if (!user || user.accessToken !== token) {
      throw createHttpError(401, 'Not authorized (user not found)');
    }

    req.user = user;
    next();
  } catch {
    next(createHttpError(401, 'Not authorized'));
  }
};

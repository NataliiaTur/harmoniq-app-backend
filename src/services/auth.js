import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import { registerUserSchema } from '../validation/authValidation.js';
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from '../utils/token.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { sanitizeText } from '../utils/sanitizer.js';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const findUserByEmail = async (email) => {
  return await UserCollection.findOne({ email });
};

//registration
export const registerUser = async ({ name, email, password }, avatarFile) => {
  const { error } = registerUserSchema.validate({ name, email, password });
  if (error) {
    throw createHttpError(400, error.details[0].message);
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw createHttpError(409, 'Email already registered');
  }

  const hashedPassword = await hashPassword(password);

  let avatarURL = '';
  if (avatarFile) {
    avatarURL = await saveFileToCloudinary(avatarFile);
  }
  name = sanitizeText(name);
  const newUser = await UserCollection.create({
    name,
    email,
    password: hashedPassword,
    avatar: avatarURL,
  });

  return newUser;
};

//login
export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid email or password');
  }

  const payload = { id: user._id };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

   // ⭐ ДОДАЙТЕ ЛОГУВАННЯ
  console.log('🔑 Before save:', {
    oldTokens: user.refreshTokens,
    newToken: refreshToken.substring(0, 20)
  });

  // ⭐ Додаємо новий токен до масиву
  if (!user.refreshTokens) user.refreshTokens = [];
  user.refreshTokens.push(refreshToken);

  // Обмежуємо до 5 токенів (5 активних пристроїв)
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  user.accessToken = accessToken;
  await user.save();

  // ⭐ ДОДАЙТЕ ЛОГУВАННЯ
  console.log('✅ After save:', {
    tokensCount: user.refreshTokens.length,
    tokens: user.refreshTokens.map(t => t.substring(0, 20))
  });

  return user;
};

//refresh
export const refreshTokens = async (token) => {
  if (!token) {
    throw createHttpError(401, 'Refresh token is required');
  }

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    console.error('❌ Token verification failed:', error.message);
    throw createHttpError(403, 'Non-valid refresh token');
  }

  const user = await UserCollection.findById(payload.id);

   // ⭐ ДОДАЙТЕ ЛОГУВАННЯ
  console.log('🔍 Refresh attempt:', {
    userId: user?._id,
    hasRefreshTokens: !!user?.refreshTokens,
    tokensCount: user?.refreshTokens?.length,
    tokenExists: user?.refreshTokens?.includes(token),
    receivedToken: token.substring(0, 20),
    storedTokens: user?.refreshTokens?.map(t => t.substring(0, 20))
  });

  // ⭐ Перевіряємо чи токен є в масиві
  if (!user || !user.refreshTokens?.includes(token)) {
    throw createHttpError(403, 'Invalid refresh token');
  }

  const newAccessToken = generateAccessToken({ id: user._id });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  // ⭐ Замінюємо старий токен на новий в масиві
  const tokenIndex = user.refreshTokens.indexOf(token);

  user.refreshTokens[tokenIndex] = newRefreshToken;
  user.accessToken = newAccessToken;
  await user.save();

  console.log('✅ Tokens refreshed successfully');
  
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

// logout
export const logoutUser = async (userId, refreshToken) => {
  const user = await UserCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // ⭐ Видаляємо тільки цей конкретний токен
  if (refreshToken) {
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
  } else {
    // Або видаляємо всі токени (logout з усіх пристроїв)
    user.refreshTokens = [];
  }

  user.accessToken = '';
  await user.save();
};

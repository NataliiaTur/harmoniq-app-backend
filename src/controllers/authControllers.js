import {
  refreshTokens,
  registerUser,
  loginUser,
  logoutUser,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const result = await loginUser(req.body);

  res.status(200).json({
    status: 200,
    message: 'Login successful',
    data: result,
  });
};

export const refreshTokensController = async (req, res) => {
  const { refreshToken } = req.body;

  const tokens = await refreshTokens(refreshToken);

  res.status(200).json({
    status: 200,
    message: 'Tokens refreshed',
    data: tokens,
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.user._id);

  res.status(200).json({
    status: 200,
    message: 'Logout successful',
    data: null,
  });
};

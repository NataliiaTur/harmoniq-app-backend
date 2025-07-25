import { registerUser, loginUser } from '../services/auth.js';

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

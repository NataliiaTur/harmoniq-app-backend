import { registerUser } from '../services/auth.js';

export const registerUserController = async (req, res) => {
  try {
    const avatarPath = req.file ? req.file.path : '';
    const user = await registerUser(req.body, avatarPath);

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(400).json({ message: error.message });
  }
};

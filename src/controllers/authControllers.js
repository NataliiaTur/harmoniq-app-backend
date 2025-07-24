import { validateRegisterData } from '../validation/authValidation.js';
import { hashPassword, findUserByEmail } from '../services/auth.js';
import User from '../db/models/user.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationErrors = validateRegisterData({ name, email, password });
    if (validationErrors.length > 0) {
      return res.status(400).json({ message: validationErrors.join(', ') });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await hashPassword(password);
    const avatar = req.file ? req.file.path : '';

    const newUser = new User({ name, email, password: hashedPassword, avatar });
    await newUser.save();

    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// import jwt from 'jsonwebtoken';
// import { User } from '../models/User.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;
//     if (!token) throw new Error('Unauthorized');

//     const { id } = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(id);
//     if (!user) throw new Error('Unauthorized');

//     req.user = user;
//     next();
//   } catch {
//     res.status(401).json({ message: 'Not authorized' });
//   }
// };

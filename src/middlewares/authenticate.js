// import jwt from 'jsonwebtoken';
// import { UserCollection } from '../db/models/user.js';

// export const authenticate = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;
//     if (!token) throw new Error('Unauthorized');

//     const { id } = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await UserCollection.findById(id);
//     if (!user) throw new Error('Unauthorized');

//     req.user = user;
//     next();
//   } catch {
//     res.status(401).json({ message: 'Not authorized' });
//   }
// };

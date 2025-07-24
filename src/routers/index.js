import { Router } from 'express';
import articlesRouter from './articleRouters.js';
import usersRouter from './userRouters.js';
import authRouter from './authRouters.js';

const router = Router();

router.use('/articles', articlesRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);

export default router;

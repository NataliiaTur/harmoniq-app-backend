import express from 'express';
import { registerUserController } from '../controllers/authControllers.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', upload.single('avatar'), registerUserController);

export default router;

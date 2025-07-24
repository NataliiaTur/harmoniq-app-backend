import express from 'express';
import { register } from '../controllers/authControllers.js';
import { upload } from '../middlewares/multer.js';

const router = express.Router();

router.post('/register', upload.single('avatar'), register);

export default router;

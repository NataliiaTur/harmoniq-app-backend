import multer from 'multer';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import createError from 'http-errors';

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const storage = multer.diskStorage({
  destination: TEMP_UPLOAD_DIR,
  filename: (_req, file, cb) => {
    const unique = Date.now();
    cb(null, `${unique}_${file.originalname}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(createError(400, 'Invalid image format'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter,
});

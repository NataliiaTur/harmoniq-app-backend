import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  if (!file || !file.path) {
    throw new Error('File path is missing');
  }
  const { secure_url } = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'uploads',
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  });
  await fs.unlink(file.path);
  return secure_url;
};

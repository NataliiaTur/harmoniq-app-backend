import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import router from './routers/index.js';

import { corsOptions } from './middlewares/cors.js';
import { loggerPino } from './middlewares/loggerPino.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import analyticsRoutes from './routers/analyticsRoutes.js';

const PORT = Number(getEnvVar('PORT', 3000));

export const startServer = () => {
  const app = express();
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(cookieParser());

  app.use(loggerPino);

  app.use('/api/analytics', analyticsRoutes);
  app.use('/api', router);
  
  app.use('/api-docs', swaggerDocs());

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

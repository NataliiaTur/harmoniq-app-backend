import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';
import { testArticlesOwners } from './controllers/userControllers.js';

const bootstrap = async () => {
  await initMongoDB();
  startServer();
  await testArticlesOwners();
};

bootstrap();

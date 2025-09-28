import mongoose from 'mongoose';

// import { getEnvVar } from '../utils/getEnvVar.js';

// export const initMongoDB = async () => {
//   try {
//     const user = getEnvVar('MONGODB_USER');
//     const pwd = getEnvVar('MONGODB_PASSWORD');
//     const url = getEnvVar('MONGODB_URL');
//     const db = getEnvVar('MONGODB_DB');

//     await mongoose.connect(
//       `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,
//     );
//     console.log('Mongo connection successfully established!');
//   } catch (e) {
//     console.log('Error while setting up mongo connection', e);
//     throw e;
//   }
// };

import { getEnvVar } from '../utils/getEnvVar.js';

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const pwd = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    // 👇 Додаєш лог для перевірки
    console.log('Mongo ENV values:', { user, pwd: '***', url, db });

    const connectionString = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;
    console.log('Mongo connection string:', connectionString);

    await mongoose.connect(connectionString);
    console.log('Mongo connection successfully established!');
  } catch (e) {
    console.log('Error while setting up mongo connection', e);
    throw e;
  }
};

import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import { ArticlesCollection } from './src/db/models/article.js';
import { UserCollection } from './src/db/models/user.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const fixArticlesAndOwners = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connected');

    const users = await UserCollection.find();
    const userMap = {};
    users.forEach(user => {
      userMap[user.id] = user._id; // створюємо мапу старого id -> ObjectId
    });

    const articles = await ArticlesCollection.find();

    for (const article of articles) {
      let updated = false;

      // 1. Перевіряємо ownerId
      if (article.ownerId && typeof article.ownerId === 'string' && userMap[article.ownerId]) {
        article.ownerId = userMap[article.ownerId];
        updated = true;
      }

      // 2. Перевіряємо _id (рядковий чи ObjectId)
      if (typeof article._id === 'string') {
        const oldId = article._id;
        const newId = new Types.ObjectId();

        await ArticlesCollection.create({
          ...article.toObject(),
          _id: newId,
        });
        await ArticlesCollection.deleteOne({ _id: oldId });
        console.log(`Replaced article _id ${oldId} -> ${newId}`);
        continue; // вже створили новий документ, далі з цим не працюємо
      }

      if (updated) {
        await article.save();
        console.log(`Updated article ownerId for _id ${article._id}`);
      }
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixArticlesAndOwners();

import mongoose, { Types } from 'mongoose';
import dotenv from 'dotenv';
import { ArticlesCollection } from './src/db/models/article.js';
import { UserCollection } from './src/db/models/user.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const fixOwnerIds = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connected');

    const articles = await ArticlesCollection.find();

    for (const article of articles) {
      // Якщо ownerId вже ObjectId — пропускаємо
      if (Types.ObjectId.isValid(article.ownerId) && typeof article.ownerId !== 'string') continue;

      let user;
      // Якщо ownerId рядок (старий id)
      if (typeof article.ownerId === 'string') {
        user = await UserCollection.findOne({ id: article.ownerId });
      }

      if (!user) {
        console.log(`User not found for article ${article._id}, ownerId: ${article.ownerId}`);
        continue;
      }

      article.ownerId = user._id; // замінюємо на ObjectId
      await article.save();
      console.log(`Updated article ${article._id} ownerId -> ${user._id}`);
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixOwnerIds();

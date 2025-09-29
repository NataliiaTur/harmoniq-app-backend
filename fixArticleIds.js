import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixAllIds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Mongo connected');

    const db = mongoose.connection.db;

    // ========== ВИПРАВЛЯЄМО СТАТТІ ==========
    console.log('\n📰 Fixing articles...');
    const articles = await db.collection('harmoniq-articles').find({}).toArray();
    console.log(`Found ${articles.length} articles`);

    if (articles.length > 0) {
      await db.collection('harmoniq-articles').deleteMany({});

      const fixedArticles = articles.map(article => ({
        ...article,
        _id: new mongoose.Types.ObjectId(article._id),
        ownerId: new mongoose.Types.ObjectId(article.ownerId)
      }));

      await db.collection('harmoniq-articles').insertMany(fixedArticles);
      console.log('✅ Articles fixed!');
    }

    // ========== ВИПРАВЛЯЄМО КОРИСТУВАЧІВ ==========
    console.log('\n👥 Fixing users...');
    const users = await db.collection('harmoniq-users').find({}).toArray();
    console.log(`Found ${users.length} users`);

    if (users.length > 0) {
      await db.collection('harmoniq-users').deleteMany({});

      const fixedUsers = users.map(user => ({
        ...user,
        _id: new mongoose.Types.ObjectId(user._id),
        // Виправляємо масиви з ID
        savedArticles: (user.savedArticles || []).map(id =>
          new mongoose.Types.ObjectId(id)
        ),
        followers: (user.followers || []).map(id =>
          new mongoose.Types.ObjectId(id)
        ),
        following: (user.following || []).map(id =>
          new mongoose.Types.ObjectId(id)
        )
      }));

      await db.collection('harmoniq-users').insertMany(fixedUsers);
      console.log('✅ Users fixed!');
    }

    console.log('\n🎉 All done! Database is ready.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

fixAllIds();

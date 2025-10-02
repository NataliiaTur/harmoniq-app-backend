// src/controllers/analyticsControllers.js
import { UserSessionCollection } from '../db/models/UserSession.js';
import { ArticlesCollection } from '../db/models/article.js';
import createError from 'http-errors';
import { UAParser } from 'ua-parser-js';

export const createSessionController = async (req, res) => {
  const {
    sessionId,
    fingerprint,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    userAgent,
    currentUrl,
  } = req.body;

  // Парсимо userAgent для отримання інфо про пристрій
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const deviceType = result.device.type || 'desktop';

  const session = await UserSessionCollection.create({
    sessionId,
    fingerprint,
    referrer,
    utmSource,
    utmMedium,
    utmCampaign,
    userAgent,
    device: deviceType,
    browser: result.browser.name,
    os: result.os.name,
    pagesVisited: [currentUrl],
  });

  res.status(201).json({ sessionId: session.sessionId });
};

export const trackEventController = async (req, res) => {
  const { sessionId, type, data } = req.body;

   // ⭐ ДОДАЙТЕ ЛОГУВАННЯ
  console.log('📊 Track event received:', { sessionId, type, data });

  const session = await UserSessionCollection.findOne({ sessionId });

  if (!session) {
    console.error('❌ Session not found:', sessionId);
    return res.status(404).json({ message: 'Session not found' });
  }

  // Додаємо подію
  session.events.push({ type, data, timestamp: new Date() });

  // Оновлюємо специфічні поля залежно від типу події
  if (type === 'page_view' && data.url && !session.pagesVisited.includes(data.url)) {
    session.pagesVisited.push(data.url);
  }

  if (type === 'article_view' && data.articleId && data.authorId) {
    session.articlesViewed.push({
      articleId: data.articleId,
      authorId: data.authorId,
      timestamp: new Date(),
    });
  }

  if (type === 'add_to_favorites' && data.articleId && data.authorId) {
    // ⭐ ДОДАЙТЕ ЛОГУВАННЯ
    console.log('✅ Adding to favorites:', {
      articleId: data.articleId,
      authorId: data.authorId
    });
    
    session.addedToFavorites.push({
      articleId: data.articleId,
      authorId: data.authorId,
      timestamp: new Date(),
    });
  }

  if (type === 'session_end' && data.totalTime) {
    session.endTime = new Date();
    session.totalDuration = Math.round(data.totalTime / 1000);
  }

  await session.save();
  res.status(200).json({ success: true });
};

export const getTeacherAnalyticsController = async (req, res) => {
  const teacherId = req.user.id;
  const { startDate, endDate } = req.query;

  // Створюємо фільтр за датами
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const query = {
    $or: [
      { 'articlesViewed.authorId': teacherId },
      { 'addedToFavorites.authorId': teacherId },
    ],
  };

  if (Object.keys(dateFilter).length > 0) {
    query.startTime = dateFilter;
  }

  const sessions = await UserSessionCollection.find(query)
    .populate('articlesViewed.articleId', 'title img')
    .populate('addedToFavorites.articleId', 'title img');

  // Збираємо статистику
  const analytics = {
    totalVisitors: sessions.length,
    totalPageViews: 0,
    trafficSources: {},
    popularArticles: {},
    favoritesCount: 0,
    avgSessionDuration: 0,
    deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
    articleStats: {},
  };

  let totalDuration = 0;
  let sessionsWithDuration = 0;

  sessions.forEach((session) => {
    // Переглядів сторінок
    analytics.totalPageViews += session.pagesVisited.length;

    // Джерела трафіку
    const source = session.utmSource || 'direct';
    analytics.trafficSources[source] = (analytics.trafficSources[source] || 0) + 1;

    // Пристрої
    if (session.device) {
      analytics.deviceBreakdown[session.device]++;
    }

    // Середня тривалість
    if (session.totalDuration) {
      totalDuration += session.totalDuration;
      sessionsWithDuration++;
    }

    // Статистика по статтях викладача
    session.articlesViewed.forEach((viewed) => {
      if (viewed.authorId.toString() === teacherId) {
        const articleId = viewed.articleId._id.toString();
        if (!analytics.articleStats[articleId]) {
          analytics.articleStats[articleId] = {
            title: viewed.articleId.title,
            img: viewed.articleId.img,
            views: 0,
            addedToFavorites: 0,
          };
        }
        analytics.articleStats[articleId].views++;
      }
    });

    session.addedToFavorites.forEach((favorite) => {
      if (favorite.authorId.toString() === teacherId) {
        analytics.favoritesCount++;
        const articleId = favorite.articleId._id.toString();
        if (analytics.articleStats[articleId]) {
          analytics.articleStats[articleId].addedToFavorites++;
        }
      }
    });
  });

  // Обчислюємо середню тривалість
  analytics.avgSessionDuration = sessionsWithDuration > 0
    ? Math.round(totalDuration / sessionsWithDuration)
    : 0;

  // Конверсія: відвідувачі → додавання в обрані
  analytics.conversionRate = sessions.length > 0
    ? ((analytics.favoritesCount / sessions.length) * 100).toFixed(2)
    : '0.00';

  // Топ статей
  analytics.topArticles = Object.values(analytics.articleStats)
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  res.json(analytics);
};

export const getUserJourneyController = async (req, res) => {
  const { sessionId } = req.params;

  const session = await UserSessionCollection.findOne({ sessionId })
    .populate('articlesViewed.articleId', 'title')
    .populate('addedToFavorites.articleId', 'title');

  if (!session) {
    throw createError(404, 'Session not found');
  }

  const journey = session.events.map((event) => ({
    type: event.type,
    timestamp: event.timestamp,
    data: event.data,
  }));

  res.json({
    session: {
      sessionId: session.sessionId,
      startTime: session.startTime,
      endTime: session.endTime,
      totalDuration: session.totalDuration,
      device: session.device,
      browser: session.browser,
      referrer: session.referrer,
      utmSource: session.utmSource,
      pagesVisited: session.pagesVisited,
    },
    journey,
  });
};

export const getAllSessionsController = async (req, res) => {
  const teacherId = req.user.id;
  const { page = 1, limit = 20 } = req.query;

  const skip = (page - 1) * limit;

  const [sessions, total] = await Promise.all([
    UserSessionCollection.find({
      $or: [
        { 'articlesViewed.authorId': teacherId },
        { 'addedToFavorites.authorId': teacherId },
      ],
    })
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('sessionId fingerprint startTime endTime totalDuration device browser utmSource pagesVisited'),

    UserSessionCollection.countDocuments({
      $or: [
        { 'articlesViewed.authorId': teacherId },
        { 'addedToFavorites.authorId': teacherId },
      ],
    }),
  ]);

  res.json({
    sessions,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
  });
};

// src/db/models/UserSession.js
import { Schema, model } from 'mongoose';

const eventSchema = new Schema({
  type: {
    type: String,
    enum: [
      'page_view',
      'article_view',
      'add_to_favorites',
      'remove_from_favorites',
      'click',
      'scroll',
      'time_on_page',
      'session_end',
      'follow',
      'unfollow',
      'search',
      'article_create'
    ],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  data: Schema.Types.Mixed,
}, { _id: false });

const userSessionSchema = new Schema(
  {
    // Ідентифікація
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fingerprint: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true, index: true },

    // Джерело трафіку
    referrer: { type: String },
    utmSource: { type: String, index: true },
    utmMedium: { type: String },
    utmCampaign: { type: String },

    // Технічні дані
    userAgent: { type: String },
    device: { type: String, enum: ['mobile', 'tablet', 'desktop'] },
    browser: { type: String },
    os: { type: String },

    // Події
    events: [eventSchema],

    // Метрики
    startTime: { type: Date, default: Date.now, index: true },
    endTime: { type: Date },
    totalDuration: { type: Number },
    pagesVisited: [{ type: String }],

    // Конверсії
    articlesViewed: [{
      articleId: { type: Schema.Types.ObjectId, ref: 'Article' },
      authorId: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date,
    }],
    addedToFavorites: [{
      articleId: { type: Schema.Types.ObjectId, ref: 'Article' },
      authorId: { type: Schema.Types.ObjectId, ref: 'User' },
      timestamp: Date,
    }],
    follows: [{
      targetUserId: { type: Schema.Types.ObjectId, ref : 'User'},
      timestamp: Date,
    }]
  },
  {
    collection: 'harmoniq-sessions',
    timestamps: true,
    versionKey: false,
  }
);

// Індекси для швидкого пошуку
userSessionSchema.index({ 'articlesViewed.authorId': 1, startTime: -1 });
userSessionSchema.index({ 'addedToFavorites.authorId': 1, startTime: -1 });
userSessionSchema.index({ 'follows.targetUserId': 1, startTime: -1 });

export const UserSessionCollection = model('UserSession', userSessionSchema);

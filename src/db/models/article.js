import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    img: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    article: {
      type: String,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'harmoniq-articles',
    timestamps: true,
    versionKey: false,
  },
);

export const ArticlesCollection = model('Article', articleSchema);

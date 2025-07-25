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
    desc: {
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
    rate: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Дата повинна бути в форматі YYYY-MM-DD'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ArticlesCollection = model('Article', articleSchema);

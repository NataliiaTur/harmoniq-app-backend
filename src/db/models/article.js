import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 48,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      minlength: 100,
      maxlength: 4000,
      trim: true,
    },
    article: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['popular', 'general'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ArticlesCollection = model('Article', articleSchema);

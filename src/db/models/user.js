import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+@.+\..+/, 'Email must be valid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    avatarURL: {
      type: String,
      default: '',
    },
    savedArticles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
const User = model('User', userSchema);
export default User;

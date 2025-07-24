import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 64,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 64,
  },
  avatar: {
    type: String, // url
    default: '',
  },
  refreshToken: {
    type: String,
    default: '',
  },
});

export default mongoose.model('User', userSchema);

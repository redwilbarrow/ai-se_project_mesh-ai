import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

export default User;

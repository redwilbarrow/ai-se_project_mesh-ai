import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: [true, 'Must enter a password'],
    minlength: [12, 'Password must be at least 12 characters'],
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Name cannot be empty'],
  },
});

const User = mongoose.model('User', userSchema);

export default User;

import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Chat title cannot be blank'],
    default: 'New Chat',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;

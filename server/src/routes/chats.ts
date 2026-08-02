import { Router } from 'express';
import {
  getChats,
  createChat,
  getChat,
  deleteChat,
} from '../controllers/chats.js';
import { createMessage } from '../controllers/messages.js';
import { auth } from '../middleware/auth.js';

const chatRouter = Router();

chatRouter.get('/', auth, getChats);
chatRouter.post('/', auth, createChat);
chatRouter.get('/:id', auth, getChat);
chatRouter.delete('/:id', auth, deleteChat);
chatRouter.post('/:id/messages', auth, createMessage);

export { chatRouter };

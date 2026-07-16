import { Router } from 'express';
import {
  listChats,
  createChat,
  fetchChat,
  deleteChat,
  messageChat,
} from '../controllers/chats.js';
import { auth } from '../middleware/auth.js';

const chatRouter = Router();

chatRouter.get('/', auth, listChats);
chatRouter.post('/', auth, createChat);
chatRouter.get('/:id', auth, fetchChat);
chatRouter.delete('/:id', auth, deleteChat);
chatRouter.post('/:id/messages', auth, messageChat);

export { chatRouter };

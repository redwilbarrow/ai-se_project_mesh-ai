import { Router } from 'express';
import {
  listChats,
  createChat,
  fetchChat,
  deleteChat,
  messageChat,
} from '../controllers/chats.js';

const chatRouter = Router();

chatRouter.get('/', listChats);
chatRouter.post('/', createChat);
chatRouter.get('/:id', fetchChat);
chatRouter.delete('/:id', deleteChat);
chatRouter.post('/:id/messages', messageChat);

export { chatRouter };

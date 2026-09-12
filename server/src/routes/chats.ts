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
chatRouter.use(auth);

chatRouter.get("/", getChats);
chatRouter.post("/", createChat);
chatRouter.get("/:id", getChat);
chatRouter.delete("/:id", deleteChat);
chatRouter.post("/:id/messages", createMessage);

export { chatRouter };

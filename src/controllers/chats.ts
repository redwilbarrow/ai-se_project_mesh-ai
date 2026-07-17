import type { Request, Response } from 'express';
import Chat from '../models/chat.js';
import Message from '../models/message.js';

export const getChats = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  // TODO: add error handling for chat lookup
  const chats = await Chat.find({ userId });

  res.status(200).json({
    success: true,
    data: chats,
    error: null,
  });
};

export const createChat = async (req: Request, res: Response) => {
  const { title } = req.body;
  // TODO: add error handling for chat creation

  if (!title) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Title is required' },
    });
  }

  const chat = await Chat.create({
    title,
    userId: req.user!.userId,
  });

  res.status(201).json({
    success: true,
    data: chat,
    error: null,
  });
};

export const getChat = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  // TODO: add error handling for chat and message lookup
  const chat = await Chat.findOne({ _id: req.params.id, userId });

  if (!chat) {
    return res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Chat not found' },
    });
  }

  const messages = await Message.find({ chatId: chat._id }).sort({
    createdAt: 1,
  });

  res.status(200).json({
    success: true,
    data: { chat, messages },
    error: null,
  });
};

export const deleteChat = (req: Request, res: Response): void => {
  // TODO: add error handling for deleteChat
  res.status(204).send();
};

export const messageChat = (req: Request, res: Response): void => {
  // TODO: add error handling for messageChat
  res.status(201).json({
    success: true,
    data: {},
    error: null,
  });
};

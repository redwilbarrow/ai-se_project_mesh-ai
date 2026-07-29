import type { Request, Response } from 'express';
import Message from '../models/message.js';
import Chat from '../models/chat.js';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { getClient, LLM_MODEL, buildContext } from '../utils/openai-client.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';

export const createMessage = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { question } = req.body;
  const chatId = req.params.id;
  const userId = req.user!.userId;

  if (!question) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'question is required' },
    });
    return;
  }

  // TODO: add error handling for chat lookup failures
  const chat = await Chat.findOne({ _id: chatId, userId });

  if (!chat) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'Chat not found' },
    });
    return;
  }

  // TODO: handle errors from document lookup
  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((d) => d._id);
  // TODO: handle errors from chunk lookup
  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));

  // TODO: validate and handle errors from the embedding service
  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
  const context = buildContext(ranked);

  // TODO: add OpenAI request error handling and retry logic
  const response = await getClient().chat.completions.create({
    model: LLM_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful research assistant. Answer the question using only the provided context. If the context does not contain enough information to answer, say so. /no_think',
      },
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion:\n${question} /no_think`,
      },
    ],
    temperature: 0.2,
  });

  let answer = response.choices[0]!.message.content ?? 'No answer returned';
  answer = answer.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();

  // TODO: make message creation atomic so user and assistant messages are saved together
  const userMessage = await Message.create({
    chatId,
    role: 'user',
    content: question,
  });

  const assistantMessage = await Message.create({
    chatId,
    role: 'assistant',
    content: answer,
  });

  res.status(201).json({
    success: true,
    data: [userMessage, assistantMessage],
    error: null,
  });
};

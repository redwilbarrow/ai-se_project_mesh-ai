import type { Request, Response } from 'express';
import Chunk from '../models/chunk.js';
import Document from '../models/document.js';
import { getClient, LLM_MODEL, buildContext } from '../utils/openai-client.js';
import { createEmbedding } from '../utils/embeddings.js';
import { rankBySimilarity } from '../utils/vector-search.js';

export const queryDocuments = async (req: Request, res: Response) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: 'A question is required' },
    });
  }

  const userId = req.user!.userId;
  const userDocs = await Document.find({ userId }, '_id');
  const docIds = userDocs.map((doc) => doc._id);

  const chunkRecords = await Chunk.find({ documentId: { $in: docIds } });
  const chunks = chunkRecords.map((c) => ({
    id: String(c._id),
    documentId: String(c.documentId),
    text: c.text,
    embedding: c.embedding,
  }));

  const queryEmbedding = await createEmbedding(question);
  const ranked = rankBySimilarity(queryEmbedding, chunks, 5);
  const context = buildContext(ranked);

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

  // Extract the raw response text
  let answer = response.choices[0]!.message.content ?? 'No answer returned';

  // Strip out <think> tags, any text inside them, and trailing whitespace
  answer = answer.replace(/<think>[\s\S]*?<\/think>\s*/g, '').trim();

  res.status(200).json({
    success: true,
    data: { question, chunks: ranked, answer },
    error: null,
  });
};

import type { Request, Response } from 'express';
import { readFileSync } from 'node:fs';
import { PDFParse } from 'pdf-parse';
import Document from '../models/document.js';
import Chunk from '../models/chunk.js';
import { chunkText } from '../utils/chunk.js';
import { createEmbedding } from '../utils/embeddings.js';

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: 'File is required' },
    });
  }

  // Parse the file
  const buffer = readFileSync(req.file.path);
  const parser = new PDFParse({ data: buffer });
  const { text } = await parser.getText();

  // Chunk the text
  const chunks = chunkText(text);

  // Extract the title from the body, or req.file.originalname
  const title = req.body.title || req.file.originalname;

  // Create a Document document. See the models/document.ts
  const document = await Document.create({
    title,
    fileName: req.file.originalname,
    userId: req.user!.userId,
  });

  // For each chunk, create a Chunk document see models/chunk.ts
  await Promise.all(
    chunks.map(async (chunk) =>
      Chunk.create({
        documentId: document._id,
        text: chunk,
        embedding: await createEmbedding(chunk),
      }),
    ),
  );

  const { _id, fileName, createdAt } = document;

  return res.status(201).json({
    success: true,
    data: { _id, title, fileName, createdAt },
    error: null,
  });
};

export const getDocuments = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  // TODO: Add try/catch error handling around fetching documents.
  const documents = await Document.find({ userId });

  res.status(200).json({
    success: true,
    data: documents,
    error: null,
  });
};

export const fetchDocument = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {},
    error: null,
  });
};

export const deleteDocument = (req: Request, res: Response): void => {
  res.status(204).send();
};

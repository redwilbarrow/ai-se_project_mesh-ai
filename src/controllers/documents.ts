import type { Request, Response } from 'express';
import Document from '../models/document.js';

export const uploadDocument = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { message: 'File is required' },
    });
  }

  const title = req.body.title || req.file.originalname;

  // TODO: Add try/catch around document upload and database create so DB failures return a proper error response instead of crashing.
  const document = await Document.create({
    title,
    fileName: req.file.originalname,
    userId: req.user!.userId,
  });

  res.status(201).json({
    success: true,
    data: document,
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

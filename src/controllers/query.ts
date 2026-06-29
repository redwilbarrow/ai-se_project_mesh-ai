import type { Request, Response } from 'express';

export const queryRAG = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: {},
    error: null,
  });
};

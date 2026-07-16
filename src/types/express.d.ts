declare global {
  namespace Express {
    interface Request {
      uers?: { userId: string };
    }
  }
}

export {};

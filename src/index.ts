import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from './routes/index.js';
import { logger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.get('/health', (req, res): void => {
  res.status(200).json({
    success: true,
    data: { status: 'ok' },
    error: null,
  });
});
app.use(router);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

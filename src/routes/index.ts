import { Router } from 'express';
import { authRouter } from './auth.js';
import { chatRouter } from './chats.js';
import { docsRouter } from './docs.js';
import { queryRouter } from './query.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/chats', chatRouter);
router.use('/documents', docsRouter);
router.use('/query', queryRouter);

export default router;

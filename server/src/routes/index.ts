import { Router } from 'express';
import { authRouter } from './auth.js';
import { usersRouter } from './users.js';
import { chatRouter } from './chats.js';
import { documentsRouter } from './documents.js';
import { queryRouter } from './query.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/chats', chatRouter);
router.use('/documents', documentsRouter);
router.use('/query', queryRouter);

export default router;

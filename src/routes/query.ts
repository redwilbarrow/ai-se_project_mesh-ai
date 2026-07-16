import { Router } from 'express';
import { queryRAG } from '../controllers/query.js';
import { auth } from '../middleware/auth.js';

const queryRouter = Router();

queryRouter.post('/', auth, queryRAG);

export { queryRouter };

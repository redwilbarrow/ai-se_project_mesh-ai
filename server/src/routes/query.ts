import { Router } from 'express';
import { queryDocuments } from '../controllers/query.js';
import { auth } from '../middleware/auth.js';

const queryRouter = Router();

queryRouter.post('/', auth, queryDocuments);

export { queryRouter };

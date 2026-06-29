import { Router } from 'express';
import { queryRAG } from '../controllers/query.js';

const queryRouter = Router();

queryRouter.post('/', queryRAG);

export { queryRouter };

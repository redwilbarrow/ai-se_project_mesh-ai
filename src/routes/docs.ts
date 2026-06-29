import { Router } from 'express';
import {
  uploadDoc,
  listDocs,
  fetchDoc,
  deleteDoc,
} from '../controllers/docs.js';

const docsRouter = Router();

docsRouter.post('/', uploadDoc);
docsRouter.get('/', listDocs);
docsRouter.get('/:id', fetchDoc);
docsRouter.delete('/:id', deleteDoc);

export { docsRouter };

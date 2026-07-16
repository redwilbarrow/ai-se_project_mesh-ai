import { Router } from 'express';
import {
  uploadDoc,
  listDocs,
  fetchDoc,
  deleteDoc,
} from '../controllers/docs.js';
import { auth } from '../middleware/auth.js';

const docsRouter = Router();

docsRouter.post('/', auth, uploadDoc);
docsRouter.get('/', auth, listDocs);
docsRouter.get('/:id', auth, fetchDoc);
docsRouter.delete('/:id', auth, deleteDoc);

export { docsRouter };

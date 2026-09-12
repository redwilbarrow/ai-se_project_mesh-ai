import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from '../controllers/documents.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const documentsRouter = Router();
documentsRouter.use(auth);

// TODO: update upload route to support duplicate-file replacement flow, e.g. accept a confirm flag or add a separate "replace document" endpoint.
documentsRouter.post('/', upload.single('file'), uploadDocument);
documentsRouter.get('/', getDocuments);
documentsRouter.get('/:id', getDocument);
documentsRouter.delete('/:id', deleteDocument);

export { documentsRouter };

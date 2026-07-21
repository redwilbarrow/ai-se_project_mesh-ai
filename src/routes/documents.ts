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

// TODO: update upload route to support duplicate-file replacement flow, e.g. accept a confirm flag or add a separate "replace document" endpoint.
documentsRouter.post('/', auth, upload.single('file'), uploadDocument);
documentsRouter.get('/', auth, getDocuments);
documentsRouter.get('/:id', auth, getDocument);
documentsRouter.delete('/:id', auth, deleteDocument);

export { documentsRouter };

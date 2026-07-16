import { Router } from 'express';
import {
  uploadDocument,
  getDocuments,
  fetchDocument,
  deleteDocument,
} from '../controllers/documents.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const documentsRouter = Router();

documentsRouter.post('/', auth, upload.single('file'), uploadDocument);
documentsRouter.get('/', auth, getDocuments);
documentsRouter.get('/:id', auth, fetchDocument);
documentsRouter.delete('/:id', auth, deleteDocument);

export { documentsRouter };

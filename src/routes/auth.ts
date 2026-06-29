import { Router } from 'express';
import { getCurrentUser, authUser, createUser } from '../controllers/auth.js';

const authRouter = Router();

authRouter.get('/me', getCurrentUser);
authRouter.post('/login', authUser);
authRouter.post('/register', createUser);

export { authRouter };

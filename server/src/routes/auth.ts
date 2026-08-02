import { Router } from 'express';
import { getCurrentUser, login, register } from '../controllers/auth.js';

const authRouter = Router();

authRouter.get('/me', getCurrentUser);
authRouter.post('/login', login);
authRouter.post('/register', register);

export { authRouter };

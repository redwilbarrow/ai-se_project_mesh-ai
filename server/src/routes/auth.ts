import { Router } from 'express';
import { login, register } from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);

export { authRouter };

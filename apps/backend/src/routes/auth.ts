import { Hono } from 'hono';
import { login, register, verify } from '../controllers/auth.js';

const authRouter = new Hono();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/verify', verify);

export { authRouter };

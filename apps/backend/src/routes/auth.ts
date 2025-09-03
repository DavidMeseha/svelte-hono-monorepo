import { Hono } from 'hono';
import { login, logout, register, verify } from '../controllers/auth.js';

const authRouter = new Hono();

authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/register', register);
authRouter.get('/verify', verify);

export { authRouter };

import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { details } from '../controllers/user.js';

const userRouter = new Hono();

userRouter.use('*', authMiddleware);
userRouter.get('/', details);

export { userRouter };

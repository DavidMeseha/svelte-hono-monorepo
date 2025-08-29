import { Hono } from 'hono';
import { productsRouter } from './products.js';
import { userRouter } from './user.js';
import { authRouter } from './auth.js';

const routes = new Hono();

routes.route('/auth', authRouter);
routes.route('/products', productsRouter);
routes.route('/user', userRouter);

export { routes };

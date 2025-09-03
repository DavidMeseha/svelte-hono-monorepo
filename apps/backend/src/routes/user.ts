import { Hono } from 'hono';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { details } from '../controllers/user.js';
import {
	addToCart,
	getCartItems,
	removeFromCart,
	clearCart,
	updateCartItem
} from '../controllers/cart.js';

const userRouter = new Hono();

userRouter.use('*', authMiddleware);
userRouter.get('/details', details);

userRouter.get('/cart/items', getCartItems);
userRouter.post('/cart/items/add', addToCart);
userRouter.delete('/cart/items/remove', removeFromCart);
userRouter.put('/cart/items/update', updateCartItem);
userRouter.delete('/cart', clearCart);

export { userRouter };

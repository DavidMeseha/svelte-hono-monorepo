import { createMiddleware } from 'hono/factory';
import { verifyAccessToken } from '../libs/utilities.js';
import { HttpStatus } from '../http-statuses.js';

export const authMiddleware = createMiddleware(async (c, next) => {
	const token = c.req.header('Authorization')?.split('Bearer ')[1];

	if (!token) {
		return c.json({ message: 'Unauthorized', success: false }, HttpStatus.UNAUTHORIZED);
	}

	try {
		const Payload = await verifyAccessToken(token);
		c.set('user', Payload);
		return next();
	} catch (err) {
		return c.json({ message: 'expired or invalid token', success: false }, HttpStatus.UNAUTHORIZED);
	}
});

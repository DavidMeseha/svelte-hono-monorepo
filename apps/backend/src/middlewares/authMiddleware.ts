import { createMiddleware } from 'hono/factory';
import { verifyAccessToken } from '../libs/utilities.js';
import { HttpStatus } from '../http-statuses.js';
import AppError from '../libs/app-error.js';

export const authMiddleware = createMiddleware(async (c, next) => {
	const token = c.req.header('Authorization')?.split('Bearer ')[1];

	if (!token) {
		throw new AppError('expired or invalid token', HttpStatus.UNAUTHORIZED);
	}

	try {
		const payload = await verifyAccessToken(token);
		c.set('user', payload);

		return next();
	} catch (err) {
		throw new AppError('expired or invalid token', HttpStatus.UNAUTHORIZED);
	}
});

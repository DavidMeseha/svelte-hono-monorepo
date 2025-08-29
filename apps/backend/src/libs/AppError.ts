import { ContentfulStatusCode } from 'hono/utils/http-status';
import { HttpStatus } from '../http-statuses.js';

export default class AppError extends Error {
	constructor(
		public message: string,
		public statusCode: ContentfulStatusCode = HttpStatus.INTERNALSERVERERROR
	) {
		super(message);
	}
}

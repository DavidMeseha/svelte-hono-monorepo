// httpStatusMap.ts

export const HttpStatus = {
	// Client Errors
	BADREQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOTFOUND: 404,
	METHODNOTALLOWED: 405,
	REQUESTTIMEOUT: 408,
	CONFLICT: 409,
	PAYLOADTOOLARGE: 413,
	UNSUPPORTEDMEDIATYPE: 415,
	TOOMANYREQUESTS: 429,

	// Server Errors
	INTERNALSERVERERROR: 500,
	NOTIMPLEMENTED: 501,
	BADGATEWAY: 502,
	SERVICEUNAVAILABLE: 503,
	GATEWAYTIMEOUT: 504,

	// Common success codes
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NOCONTENT: 204
} as const;

// Type for the keys
export type HttpStatusName = keyof typeof HttpStatus;

// Type for the status code values
export type HttpStatusCode = (typeof HttpStatus)[HttpStatusName];

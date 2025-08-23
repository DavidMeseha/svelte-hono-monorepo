// httpStatusMap.ts

export const HttpStatus = {
  // 4xx Client Errors
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  RequestTimeout: 408,
  Conflict: 409,
  PayloadTooLarge: 413,
  UnsupportedMediaType: 415,
  TooManyRequests: 429,

  // 5xx Server Errors
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,

  // Common success codes
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
} as const;

// Type for the keys
export type HttpStatusName = keyof typeof HttpStatus;

// Type for the status code values
export type HttpStatusCode = (typeof HttpStatus)[HttpStatusName];

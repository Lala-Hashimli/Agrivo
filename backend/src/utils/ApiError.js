export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

export function notFound(message = "Resource not found") {
  return new ApiError(404, message);
}

export function badRequest(message = "Bad request") {
  return new ApiError(400, message);
}

export function unauthorized(message = "Unauthorized") {
  return new ApiError(401, message);
}

export function forbidden(message = "Forbidden") {
  return new ApiError(403, message);
}

export function conflict(message = "Conflict") {
  return new ApiError(409, message);
}

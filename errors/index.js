"use strict";

class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status || 500;
  }
}

class RateLimitError extends AppError {
  constructor(message) {
    super(message || "Too many requests, please try again later", 429);
  }
}

class JwtExpiredError extends AppError {
  constructor() {
    super("JWT token expired", 403);
  }
}

class UnauthorizedError extends AppError {
  constructor(message) {
    super(message || "Unauthorized", 403);
  }
}

class NoDataError extends AppError {
  constructor(message) {
    super(message || "No request data found", 400);
  }
}

class InvalidArgumentError extends AppError {
  constructor(message) {
    super(message || "Invalid argument(s)", 400);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || "Requested resource not found", 404);
  }
}

class NotAllowedError extends AppError {
  constructor(message) {
    super(message || "Operation not allowed", 405);
  }
}

class UnknownError extends AppError {
  constructor(message) {
    super(message || "Unknown error, developers have been notified", 400);
  }
}

module.exports = {
  UnauthorizedError,
  JwtExpiredError,
  NoDataError,
  InvalidArgumentError,
  NotFoundError,
  NotAllowedError,
  UnknownError
};

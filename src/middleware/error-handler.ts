import type { ErrorRequestHandler } from "express";
import { logger } from "../config/logger.js";
import { AppError } from "../shared/errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err instanceof Error ? err : new Error(String(err));

  // identify expected application errors
  const isOperational = error instanceof AppError;

  // Separate HTTP status from application error code
  const statusCode = isOperational ? error.statusCode : 500;

  const code = isOperational ? error.code : "INTERNAL_SERVER_ERROR";

  const message = isOperational
    ? err.message
    : "An unexpected error has occurred";

  // If response headers have already been sent,
  // delegate o Express's default error handler

  if (res.headersSent) {
    return next(error);
  }

  if (statusCode >= 500) {
    logger.error(
      {
        err: error,
        method: req.method,
        path: req.originalUrl,
      },
      "Request failed",
    );
  } else {
    logger.warn(
      {
        code,
        method: req.method,
        path: req.originalUrl,
      },
      "Request rejected",
    );
  }

  // Send the consistent API error response
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
  });
};

// We dont expose stack traces or database errors to API consumers

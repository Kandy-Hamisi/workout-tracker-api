/*
 * We create our own error class to log specific error messages
 * A user attempts to log in with an incorrect password
 * A user requests a workout that doesn't exist
 * The database becomes unexpectedly unavailable
 * our AppError gives services a consistent way to communicate expected failures
 * */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

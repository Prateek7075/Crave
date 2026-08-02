export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: unknown | undefined;
  readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string, details?: unknown) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, AppError);
  }
}

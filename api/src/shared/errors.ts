import type { ErrorRequestHandler, RequestHandler } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => handler(req, res, next))
      .catch(next);
  };
}

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
) => {
  const isAppError = error instanceof AppError;
  const statusCode = isAppError ? error.statusCode : 500;
  const code = isAppError ? error.code : "INTERNAL_ERROR";
  const message = isAppError ? error.message : "Internal server error";

  // Client mistakes (4xx) are expected; only server failures need the stack
  const log = statusCode >= 500 ? console.error : console.warn;
  log("[API] Request failed", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code,
    error:
      statusCode >= 500 && error instanceof Error ? error.stack : message,
  });

  res.status(statusCode).json({
    error: {
      code,
      message,
      ...(isAppError && error.details ? { details: error.details } : {}),
    },
  });
};

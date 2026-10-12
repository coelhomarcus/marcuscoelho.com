import type { ErrorRequestHandler, RequestHandler } from "express";

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
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
  const message = isAppError ? error.message : "Erro interno do servidor";

  console.error("[API] Erro na requisição", {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    code,
    error: error instanceof Error ? error.stack : error,
  });

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
};

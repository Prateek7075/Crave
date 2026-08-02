import type { ErrorRequestHandler, Request } from "express";

import { AppError } from "../errors/app-error.js";

function getRequestId(request: Request): string {
  if (typeof request.id === "string") {
    return request.id;
  }

  return String(request.id);
}

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  const requestId = getRequestId(request);

  if (error instanceof AppError) {
    const responseBody: {
      success: false;
      error: {
        code: string;
        message: string;
        details?: unknown;
      };
      requestId: string;
    } = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
      requestId,
    };

    if (error.details !== undefined) {
      responseBody.error.details = error.details;
    }

    response.status(error.statusCode).json(responseBody);
    return;
  }

  request.log.error(
    {
      err: error,
    },
    "Unhandled request error",
  );

  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
    requestId,
  });
};

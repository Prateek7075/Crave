import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";

export function notFoundHandler(_request: Request, _response: Response, next: NextFunction): void {
  next(new AppError("The requested API route does not exist", 404, "ROUTE_NOT_FOUND"));
}

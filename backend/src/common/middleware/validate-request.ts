import type { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";

import { AppError } from "../errors/app-error.js";

type RequestSection = "body" | "params" | "query";

export interface RequestValidationSchema {
  body?: z.ZodType<unknown>;
  params?: z.ZodType<unknown>;
  query?: z.ZodType<unknown>;
}

export type ValidatedRequestData = Partial<Record<RequestSection, unknown>>;

interface ValidationDetail {
  field: string;
  message: string;
  code: string;
}

interface SectionToValidate {
  name: RequestSection;
  schema: z.ZodType<unknown> | undefined;
  value: unknown;
}

export function validateRequest(schema: RequestValidationSchema): RequestHandler {
  return async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
      const validatedRequest: ValidatedRequestData = {};

      const sections: SectionToValidate[] = [
        {
          name: "body",
          schema: schema.body,
          value: request.body,
        },
        {
          name: "params",
          schema: schema.params,
          value: request.params,
        },
        {
          name: "query",
          schema: schema.query,
          value: request.query,
        },
      ];

      for (const section of sections) {
        if (!section.schema) {
          continue;
        }

        const result = await section.schema.safeParseAsync(section.value);

        if (!result.success) {
          const details: ValidationDetail[] = result.error.issues.map((issue) => ({
            field: [section.name, ...issue.path.map(String)].join("."),
            message: issue.message,
            code: issue.code,
          }));

          next(
            new AppError("The submitted request data is invalid", 400, "VALIDATION_ERROR", details),
          );

          return;
        }

        validatedRequest[section.name] = result.data;
      }

      response.locals.validatedRequest = validatedRequest;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function getValidatedRequest<T extends ValidatedRequestData>(response: Response): T {
  const validatedRequest = response.locals.validatedRequest as unknown;

  if (typeof validatedRequest !== "object" || validatedRequest === null) {
    throw new Error(
      "Validated request data is unavailable. Ensure validateRequest runs before the controller.",
    );
  }

  return validatedRequest as T;
}

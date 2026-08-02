import express, { type Express, type Response } from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { errorHandler } from "../src/common/middleware/error-handler.js";
import { httpLogger } from "../src/common/middleware/http-logger.js";
import { getValidatedRequest, validateRequest } from "../src/common/middleware/validate-request.js";

const testBodySchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must contain at least 2 characters"),

    age: z.coerce.number().int().min(18, "Age must be at least 18"),
  })
  .strict();

type TestBody = z.infer<typeof testBodySchema>;

interface TestValidatedRequest {
  body: TestBody;
}

function createValidationTestApp(): Express {
  const app = express();

  app.use(httpLogger);
  app.use(express.json());

  app.post(
    "/test-validation",
    validateRequest({
      body: testBodySchema,
    }),
    (_request, response: Response) => {
      const validated = getValidatedRequest<TestValidatedRequest>(response);

      response.status(200).json({
        success: true,
        data: validated.body,
      });
    },
  );

  app.use(errorHandler);

  return app;
}

describe("request validation middleware", () => {
  it("passes parsed and transformed data to the controller", async () => {
    const response = await request(createValidationTestApp()).post("/test-validation").send({
      fullName: "  Prateek  ",
      age: "22",
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        fullName: "Prateek",
        age: 22,
      },
    });
  });

  it("returns the standard validation error response", async () => {
    const response = await request(createValidationTestApp()).post("/test-validation").send({
      fullName: "P",
      age: 22,
    });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The submitted request data is invalid",
        details: [
          {
            field: "body.fullName",
            message: "Full name must contain at least 2 characters",
            code: "too_small",
          },
        ],
      },
      requestId: response.headers["x-request-id"],
    });
  });
});

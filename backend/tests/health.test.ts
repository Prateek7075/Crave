import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";

describe("GET /api/v1/health/live", () => {
  it("returns the API liveness status and a request ID", async () => {
    const response = await request(createApp()).get("/api/v1/health/live");

    expect(response.status).toBe(200);

    expect(response.headers["x-request-id"]).toEqual(expect.any(String));

    expect(response.body).toEqual({
      success: true,
      data: {
        status: "UP",
      },
      message: "Crave API is running",
    });
  });

  it("preserves a valid incoming request ID", async () => {
    const response = await request(createApp())
      .get("/api/v1/health/live")
      .set("x-request-id", "crave-test-request");

    expect(response.status).toBe(200);

    expect(response.headers["x-request-id"]).toBe("crave-test-request");
  });

  it("returns the standard error response for an unknown route", async () => {
    const response = await request(createApp()).get("/api/v1/unknown-route");

    expect(response.status).toBe(404);

    expect(response.headers["x-request-id"]).toEqual(expect.any(String));

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "The requested API route does not exist",
      },
      requestId: response.headers["x-request-id"],
    });
  });
});

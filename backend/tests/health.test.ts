import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";

describe("GET /api/v1/health/live", () => {
  it("returns the API liveness status", async () => {
    const response = await request(createApp()).get("/api/v1/health/live");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        status: "UP",
      },
      message: "Crave API is running",
    });
  });
});

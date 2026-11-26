import express from "express";
import request from "supertest";

import { AppError } from "../src/shared/errors/app-error.js";
import { errorHandler } from "../src/middleware/error-handler.js";

describe("Error handler", () => {
  const app = express();

  app.get("/expected-error", (_req, _res, next) => {
    next(new AppError("User not found", 404, "USER_NOT_FOUND"));
  });

  app.get("/unexpected-error", async () => {
    throw new Error("Database credentials exposed");
  });

  app.use(errorHandler);

  it("should return the correct application error", async () => {
    const response = await request(app).get("/expected-error");

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "User not found",
      },
    });
  });

  it("should hide unexpected internal errors", async () => {
    const response = await request(app).get("/unexpected-error");

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error has occurred",
      },
    });

    expect(JSON.stringify(response.body)).not.toContain(
      "Database credentials exposed",
    );
  });
});

import { createApp } from "../src/app.js";
import request from "supertest";

// jest runs and evaluates tests
// Supertest sends HTTP requests to the express application

/*
 * toEqual() - compares complete structures
 * toHaveProperty() - Checks a specific property
 * toMatch() - checks a string against a pattern
 * */

const app = createApp();

describe("GET /health", () => {
  it("should return HTTP status 200", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
  });

  it("should return the correct response body", async () => {
    const response = await request(app).get("/health");

    expect(response.body).toEqual({
      status: "OK",
      message: "Workout Tracker API is running",
    });
  });

  it("response status is set to ok", async () => {
    const response = await request(app).get("/health");

    expect(response.body).toHaveProperty("status", "OK");
  });

  it("returns a JSON content type", async () => {
    const response = await request(app).get("/health");

    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });
});

describe("Unknown routes", () => {
  it("should return a structured 404 response", async () => {
    const response = await request(app).get("/does-not-exist");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });

  it("should handle unsupported HTTP methods", async () => {
    const response = await request(app).post("/health");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("ROUTE_NOT_FOUND");
  });
});

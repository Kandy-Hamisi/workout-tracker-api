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

// ensure that a non existent endpoint returns a 404
describe("POST /health", () => {
  it("should return HTTP status 404", async () => {
    const response = await request(app).post("/health");

    //     expect this unknown endpoint to return 404
    expect(response.status).toBe(404);
  });
});

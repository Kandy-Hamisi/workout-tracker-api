import express, { type Express } from "express";
import { pinoHttp } from "pino-http";

import { logger } from "./config/logger.js";
import { checkDatabaseConnection } from "./config/database.js";
import { checkRedisConnection } from "./config/redis.js";

import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

export const createApp = (): Express => {
  const app = express();

  // Http request logging
  app.use(pinoHttp({ logger }));

  // Request parsing
  app.use(express.json());

  // Liveness: confirms that the application process is running
  app.get("/health/live", (_req, res) => {
    res.status(200).json({
      status: "alive",
    });
  });

  // Readiness: verifies that critical dependencies are reachable
  app.get("/health/ready", async (_req, res) => {
    try {
      // the database and redis are independent we dont need to wait for postgresql before checking redis
      // Promise.all() runs both checks concurrently and rejects if either fails
      await Promise.all([checkDatabaseConnection(), checkRedisConnection()]);

      res.status(200).json({
        status: "ready",
        dependencies: {
          database: "connected",
          redis: "connected",
        },
      });
    } catch {
      res.status(503).json({
        status: "not_ready",
        message: "One or more required dependencies are unavailable",
      });
    }
  });

  // Health endpoint
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Workout Tracker API is running",
    });
  });

  // Unknown routes
  app.use(notFoundHandler);

  // Centralized error handling must be last
  app.use(errorHandler);

  return app;
};

// Middleware order matters
/*
 * Express executes middleware in the order in which we register it
 * Our order is intentional
 * pinoHttp observes incoming requests and outgoing responses
 * express.json() parses JSON request bodies
 * Application routes process requests
 * notFoundHandler handles requests that match no route
 * errorHandler handles errors passed through Express.
 * */

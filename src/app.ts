import express, { type Express } from "express";
import { pinoHttp } from "pino-http";

import { logger } from "./config/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";

export const createApp = (): Express => {
  const app = express();

  // Http request logging
  app.use(pinoHttp({ logger }));

  // Request parsing
  app.use(express.json());

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

import express, { type Express } from "express";

export const createApp = (): Express => {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "OK",
      message: "Workout Tracker API is running",
    });
  });

  return app;
};

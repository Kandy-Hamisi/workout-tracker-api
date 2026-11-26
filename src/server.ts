import { createServer } from "node:http";

import { createApp } from "./app.js";
import {
  checkDatabaseConnection,
  closeDatabaseConnection,
} from "./config/database.js";
import { checkRedisConnection, closeRedisConnection } from "./config/redis.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const startServer = async (): Promise<void> => {
  try {
    //   verify critical dependencies before accepting traffic.
    await checkDatabaseConnection();
    logger.info("Neon database connection established");

    await checkRedisConnection();
    logger.info("Redis connection established");

    const app = createApp();
    const server = createServer(app);

    server.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, "Workout Tracker API has started");
    });

    let isShuttingDown = false;

    const shutdown = async (signal: string): Promise<void> => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      logger.info({ signal }, "Shutdown initiated");

      //   Stop accepting new requests and wait for active requests.
      server.close(async (error) => {
        if (error) {
          logger.error({ err: error }, "HTTP server shutdown failed");
        }

        try {
          await Promise.all([
            closeDatabaseConnection(),
            closeRedisConnection(),
          ]);

          logger.info("All connections closed");
          process.exitCode = error ? 1 : 0;
        } catch (shutDownError) {
          logger.error(
            { err: shutDownError },
            "Error while closing application connections",
          );

          process.exitCode = 1;
        }
      });
    };

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });
  } catch (error) {
    logger.fatal({ err: error }, "Application startup failed");

    //   Attempt cleanup if startup failed pathway through
    await Promise.allSettled([
      closeDatabaseConnection(),
      closeRedisConnection(),
    ]);

    process.exitCode = 1;
  }
};

void startServer();

// const PORT = Number(process.env.PORT) || 3000;
//
// const app = createApp();
//
// await checkDatabaseConnection();
//
// logger.info("Neon database connection established");
//
// const server = app.listen(PORT, () =>
//   console.log(`Server running on http://localhost:${PORT}`),
// );
//
// process.on("SIGTERM", () => server.close());

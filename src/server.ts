import { createApp } from "./app.js";
import { checkDatabaseConnection } from "./config/database.js";
import { logger } from "./config/logger.js";

const PORT = Number(process.env.PORT) || 3000;

const app = createApp();

await checkDatabaseConnection();

logger.info("Neon database connection established");

const server = app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);

process.on("SIGTERM", () => server.close());

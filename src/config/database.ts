import { env } from "./env.js";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { drizzle } from "drizzle-orm/neon-serverless";
import { logger } from "./logger.js";

neonConfig.webSocketConstructor = ws;

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

export const db = drizzle({
  client: pool,
});

export const checkDatabaseConnection = async (): Promise<void> => {
  logger.debug("checking database connection");
  await pool.query("SELECT 1");
};

export const closeDatabaseConnection = async (): Promise<void> => {
  await pool.end();
};

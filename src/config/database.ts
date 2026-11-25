import { env } from "./env.js";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { drizzle } from "drizzle-orm/neon-serverless";

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
  await pool.query("SELECT 1");
};

export const closeDatabaseConnection = async (): Promise<void> => {
  await pool.end();
};

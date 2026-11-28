import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL_DIRECT;

if (!databaseUrl) {
  throw new Error("DATABASE_URL_DIRECT is not configured");
}

export default defineConfig({
  schema: "./src/database/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});

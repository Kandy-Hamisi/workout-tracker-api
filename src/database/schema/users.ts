import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { weightUnitEnum } from "./enums.js";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: varchar("display_name", { length: 100 }),

    preferredWeightUnit: weightUnitEnum("preferred_weight_unit")
      .default("kg")
      .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

/*
 * User  - Represents a record retrieved from PostgreSQL
 * NewUser - Represents values accepted when inserting a record
 * */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

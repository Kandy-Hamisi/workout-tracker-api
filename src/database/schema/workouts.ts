import { sql } from "drizzle-orm";

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
  check,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";
import { workoutStatusEnum } from "./enums.js";

export const workouts = pgTable(
  "workouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    title: varchar("title", { length: 150 }).notNull(),

    notes: text("notes"),

    status: workoutStatusEnum("status").default("in_progress").notNull(),

    startedAt: timestamp("started_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    completedAt: timestamp("completed_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    index("workouts_user_started_idx").on(table.userId, table.startedAt),

    check(
      "workout_valid_completion_time",
      sql`${table.completedAt} IS NULL OR ${table.completedAt} >= ${table.startedAt}`,
    ),

    check(
      "workouts_valid_completion_status",
      sql`(${table.status} = 'completed'
            AND ${table.completedAt} IS NOT NULL)
          OR
          (${table.status} <> 'completed'
            AND ${table.completedAt} IS NULL)`,
    ),
  ],
);

export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;

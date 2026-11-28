import { sql } from "drizzle-orm";

import {
  pgTable,
  uuid,
  text,
  timestamp,
  index,
  uniqueIndex,
  integer,
  check,
} from "drizzle-orm/pg-core";

import { workouts } from "./workouts.js";
import { exercises } from "./exercises.js";

export const workoutExercises = pgTable(
  "workout_exercises",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    workoutId: uuid("workout_id")
      .notNull()
      .references(() => workouts.id, {
        onDelete: "cascade",
      }),

    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, {
        onDelete: "restrict",
      }),

    position: integer("position").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("workout_exercises_position_unique").on(
      table.workoutId,
      table.position,
    ),

    index("workout_exercises_exercise_idx").on(table.exerciseId),

    check("workout_exercises_positive_position", sql`${table.position} > 0`),
  ],
);

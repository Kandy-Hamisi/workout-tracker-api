import { sql } from "drizzle-orm";

import {
  pgTable,
  uuid,
  timestamp,
  integer,
  numeric,
  boolean,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";

import { workoutExercises } from "./workout-exercises.js";
import { setTypeEnum } from "./enums.js";

export const workoutSets = pgTable(
  "workout_sets",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    workoutExerciseId: uuid("workout_exercise_id")
      .notNull()
      .references(() => workoutExercises.id, {
        onDelete: "cascade",
      }),

    setNumber: integer("set_number").notNull(),
    setType: setTypeEnum("set_type").default("working").notNull(),
    repetitions: integer("repetitions"),
    weightKg: numeric("weight_kg", {
      precision: 10,
      scale: 4,
    }),

    assistanceKg: numeric("assistance_kg", {
      precision: 10,
      scale: 4,
    }),

    bodyWeightKg: numeric("body_weight_kg", {
      precision: 10,
      scale: 4,
    }),

    durationSeconds: integer("duration_seconds"),

    distanceMeters: numeric("distance_meters", {
      precision: 12,
      scale: 3,
    }),

    restSeconds: integer("rest_seconds"),

    //   true = set completed
    //   false = set not completed
    isCompleted: boolean("is_completed").default(false).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("workout_sets_number_unique").on(
      table.workoutExerciseId,
      table.setNumber,
    ),

    // A CHECK constraint rejects a row when its expression evaluates to FALSE

    check("workout_sets_positive_set_number", sql`${table.setNumber} > 0`),

    check("workout_sets_positive_repetitions", sql`${table.repetitions} > 0`),

    check("workout_sets_nonnegative_weight", sql`${table.weightKg} >= 0`),

    check(
      "workout_sets_nonnegative_assistance",
      sql`${table.assistanceKg} >= 0`,
    ),

    check("workout_sets_positive_body_weight", sql`${table.bodyWeightKg} > 0`),

    check("workout_sets_positive_duration", sql`${table.durationSeconds} > 0`),

    check("workout_sets_positive_distance", sql`${table.distanceMeters} > 0`),

    check("workout_sets_nonnegative_rest", sql`${table.restSeconds} >= 0`),

    check(
      "workout_sets_completed_metrics",
      sql`NOT ${table.isCompleted}
          OR ${table.repetitions} IS NOT NULL
          OR ${table.durationSeconds} IS NOT NULL
          OR ${table.distanceMeters} IS NOT NULL`,
    ),
  ],
);

export type WorkoutSet = typeof workoutSets.$inferSelect;
export type NewWorkoutSet = typeof workoutSets.$inferInsert;

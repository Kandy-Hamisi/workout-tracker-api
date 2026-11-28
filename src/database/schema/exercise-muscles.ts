import {
  pgTable,
  uuid,
  primaryKey,
  index,
  timestamp,
} from "drizzle-orm/pg-core";

import { exercises } from "./exercises.js";
import { muscleGroups } from "./muscle-groups.js";
import { muscleInvolvementEnum } from "./enums.js";

export const exerciseMuscles = pgTable(
  "exercise_muscles",
  {
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id, {
        onDelete: "cascade",
      }),

    muscleGroupId: uuid("muscle_group_id")
      .notNull()
      .references(() => muscleGroups.id, {
        onDelete: "restrict",
      }),

    involvement: muscleInvolvementEnum("involvement").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // composite primary key prevents the same muscle from being assigned to the same exercise twice
    // it also creates an index covering exercise_id and muscle_group_id
    primaryKey({
      columns: [table.exerciseId, table.muscleGroupId],
    }),

    index("exercise_muscles_muscle_group_idx").on(table.muscleGroupId),
  ],
);

export type ExerciseMuscle = typeof exerciseMuscles.$inferSelect;
export type NewExerciseMuscle = typeof exerciseMuscles.$inferInsert;

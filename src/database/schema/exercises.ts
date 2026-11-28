import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

import {
  exerciseCategoryEnum,
  trackingTypeEnum,
  equipmentEnum,
} from "./enums.js";

export const exercises = pgTable(
  "exercises",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 150 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull(),
    description: text("description"),
    category: exerciseCategoryEnum("category").notNull(),
    trackingType: trackingTypeEnum("tracking_type").notNull(),
    equipment: equipmentEnum("equipment").notNull(),
    instructions: text("instructions"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("exercise_slug_unique").on(table.slug),
    index("exercise_category_idx").on(table.category),
    index("exercise_equipment_idx").on(table.equipment),
  ],
);

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;

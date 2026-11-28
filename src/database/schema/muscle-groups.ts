import {
  pgTable,
  uuid,
  varchar,
  uniqueIndex,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const muscleGroups = pgTable(
  "muscle_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 100 }).notNull(),

    slug: varchar("slug", { length: 120 }).notNull(),

    description: text("description"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("muscle_groups_name_unique").on(table.name),
    uniqueIndex("muscle_groups_slug_unique").on(table.slug),
  ],
);

export type MuscleGroup = typeof muscleGroups.$inferSelect;
export type NewMuscleGroup = typeof muscleGroups.$inferInsert;

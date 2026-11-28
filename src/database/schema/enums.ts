import { pgEnum } from "drizzle-orm/pg-core";

// using PostgreSQL enums since they enforce restrictions directly to the database.
/*
 * For example if someone bypasses our API and attempts to insert a workout with an invalid status, PostgreSQL rejects the operation
 * Changing the enums require migrations
 * */

export const weightUnitEnum = pgEnum("weight_unit", ["kg", "lb"]);

export const exerciseCategoryEnum = pgEnum("exercise_category", [
  "strength",
  "cardio",
  "flexibility",
  "mobility",
  "plyometrics",
]);

export const trackingTypeEnum = pgEnum("tracking_type", [
  "weighted",
  "bodyweight",
  "weighted_bodyweight",
  "assisted_bodyweight",
  "duration",
  "distance_duration",
  "repetitions_duration",
  "repetitions",
  "weight_duration",
  "weight_distance",
]);

export const equipmentEnum = pgEnum("equipment", [
  "none",
  "barbell",
  "dumbbell",
  "kettlebell",
  "machine",
  "cable",
  "resistance_band",
  "smith_machine",
  "pull_up_bar",
  "treadmill",
  "stationary_bike",
  "rowing_machine",
  "other",
]);

export const muscleInvolvementEnum = pgEnum("muscle_involvement", [
  "primary",
  "secondary",
]);

export const workoutStatusEnum = pgEnum("workout_status", [
  "in_progress",
  "completed",
  "canceled",
]);

export const setTypeEnum = pgEnum("set_type", [
  "warmup",
  "working",
  "cooldown",
  "dropset",
]);

CREATE TYPE "equipment" AS ENUM('none', 'barbell', 'dumbbell', 'kettlebell', 'machine', 'cable', 'resistance_band', 'smith_machine', 'pull_up_bar', 'treadmill', 'stationary_bike', 'rowing_machine', 'other');--> statement-breakpoint
CREATE TYPE "exercise_category" AS ENUM('strength', 'cardio', 'flexibility', 'mobility', 'polymetrics');--> statement-breakpoint
CREATE TYPE "muscle_involvement" AS ENUM('primary', 'secondary');--> statement-breakpoint
CREATE TYPE "set_type" AS ENUM('warmup', 'working', 'cooldown', 'dropset', 'superset');--> statement-breakpoint
CREATE TYPE "tracking_type" AS ENUM('weighted', 'bodyweight', 'weighted_bodyweight', 'assisted_bodyweight', 'duration', 'distance_duration', 'repetitions_duration', 'repetitions');--> statement-breakpoint
CREATE TYPE "weight_unit" AS ENUM('kg', 'lb');--> statement-breakpoint
CREATE TYPE "workout_status" AS ENUM('in_progress', 'completed', 'canceled');--> statement-breakpoint
CREATE TABLE "exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"description" text,
	"category" "exercise_category" NOT NULL,
	"tracking_type" "tracking_type" NOT NULL,
	"equipment" "equipment" NOT NULL,
	"instructions" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"title" varchar(150) NOT NULL,
	"notes" text,
	"status" "workout_status" DEFAULT 'in_progress'::"workout_status" NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workout_valid_completion_time" CHECK ("completed_at" IS NULL OR "completed_at" >= "started_at"),
	CONSTRAINT "workouts_valid_completion_status" CHECK (("status" = 'completed'
            AND "completed_at" IS NOT NULL)
          OR
          ("status" <> 'completed'
            AND "completed_at" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "workout_exercises" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workout_exercises_positive_position" CHECK ("position" > 0)
);
--> statement-breakpoint
CREATE TABLE "workout_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"workout_exercise_id" uuid NOT NULL,
	"set_number" integer NOT NULL,
	"set_type" "set_type" DEFAULT 'working'::"set_type" NOT NULL,
	"repetitions" integer,
	"weight_kg" numeric(10,4),
	"assistance_kg" numeric(10,4),
	"body_weight_kg" numeric(10,4),
	"duration_seconds" integer,
	"distance_meters" numeric(12,3),
	"rest_seconds" integer,
	"is_completed" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workout_sets_positive_set_number" CHECK ("set_number" > 0),
	CONSTRAINT "workout_sets_positive_repetitions" CHECK ("repetitions" > 0),
	CONSTRAINT "workout_sets_nonnegative_weight" CHECK ("weight_kg" >= 0),
	CONSTRAINT "workout_sets_nonnegative_assistance" CHECK ("assistance_kg" >= 0),
	CONSTRAINT "workout_sets_positive_body_weight" CHECK ("body_weight_kg" > 0),
	CONSTRAINT "workout_sets_positive_duration" CHECK ("duration_seconds" > 0),
	CONSTRAINT "workout_sets_positive_distance" CHECK ("distance_meters" > 0),
	CONSTRAINT "workout_sets_nonnegative_rest" CHECK ("rest_seconds" >= 0),
	CONSTRAINT "workout_sets_completed_metrics" CHECK (NOT "is_completed"
          OR "repetitions" IS NOT NULL
          OR "duration_seconds" IS NOT NULL
          OR "distance_meters" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "preferred_weight_unit" "weight_unit" DEFAULT 'kg'::"weight_unit" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "exercise_slug_unique" ON "exercises" ("slug");--> statement-breakpoint
CREATE INDEX "exercise_category_idx" ON "exercises" ("category");--> statement-breakpoint
CREATE INDEX "exercise_equipment_idx" ON "exercises" ("equipment");--> statement-breakpoint
CREATE INDEX "workouts_user_started_idx" ON "workouts" ("user_id","started_at");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_exercises_position_unique" ON "workout_exercises" ("workout_id","position");--> statement-breakpoint
CREATE INDEX "workout_exercises_exercise_idx" ON "workout_exercises" ("exercise_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workout_sets_number_unique" ON "workout_sets" ("workout_exercise_id","set_number");--> statement-breakpoint
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workout_id_workouts_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "workouts"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exercise_id_exercises_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "workout_sets" ADD CONSTRAINT "workout_sets_workout_exercise_id_workout_exercises_id_fkey" FOREIGN KEY ("workout_exercise_id") REFERENCES "workout_exercises"("id") ON DELETE CASCADE;
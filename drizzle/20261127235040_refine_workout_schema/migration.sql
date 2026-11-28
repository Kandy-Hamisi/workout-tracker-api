ALTER TYPE "tracking_type" ADD VALUE 'weight_duration';--> statement-breakpoint
ALTER TYPE "tracking_type" ADD VALUE 'weight_distance';--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "category" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "exercise_category";--> statement-breakpoint
CREATE TYPE "exercise_category" AS ENUM('strength', 'cardio', 'flexibility', 'mobility', 'plyometrics');--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "category" SET DATA TYPE "exercise_category" USING "category"::"exercise_category";--> statement-breakpoint
ALTER TABLE "workout_sets" ALTER COLUMN "set_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "workout_sets" ALTER COLUMN "set_type" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "set_type";--> statement-breakpoint
CREATE TYPE "set_type" AS ENUM('warmup', 'working', 'cooldown', 'dropset');--> statement-breakpoint
ALTER TABLE "workout_sets" ALTER COLUMN "set_type" SET DATA TYPE "set_type" USING "set_type"::"set_type";--> statement-breakpoint
ALTER TABLE "workout_sets" ALTER COLUMN "set_type" SET DEFAULT 'working'::"set_type";--> statement-breakpoint
ALTER TABLE "workout_sets" ALTER COLUMN "is_completed" SET NOT NULL;
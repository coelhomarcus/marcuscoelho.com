ALTER TABLE "anime" ADD COLUMN "synopsis" text;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "rank" integer;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "popularity" integer;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "personal_start_date" text;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "personal_finish_date" text;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "source" text;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "season" text;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "season_year" integer;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "rating" text;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "average_episode_duration" integer;--> statement-breakpoint
ALTER TABLE "anime" ADD COLUMN "studios" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "manga" ADD COLUMN "synopsis" text;--> statement-breakpoint
ALTER TABLE "manga" ADD COLUMN "rank" integer;--> statement-breakpoint
ALTER TABLE "manga" ADD COLUMN "popularity" integer;--> statement-breakpoint
ALTER TABLE "manga" ADD COLUMN "personal_start_date" text;--> statement-breakpoint
ALTER TABLE "manga" ADD COLUMN "personal_finish_date" text;
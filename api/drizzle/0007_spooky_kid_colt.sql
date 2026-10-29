CREATE TABLE "anime" (
	"mal_id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"english_title" text,
	"image_url" text,
	"list_status" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"media_type" text,
	"release_status" text,
	"mean_score" double precision,
	"start_date" text,
	"end_date" text,
	"genres" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mal_updated_at" text NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"episodes_watched" integer DEFAULT 0 NOT NULL,
	"total_episodes" integer DEFAULT 0 NOT NULL,
	"is_rewatching" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manga" (
	"mal_id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"english_title" text,
	"image_url" text,
	"list_status" text NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"media_type" text,
	"release_status" text,
	"mean_score" double precision,
	"start_date" text,
	"end_date" text,
	"genres" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"mal_updated_at" text NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"chapters_read" integer DEFAULT 0 NOT NULL,
	"total_chapters" integer DEFAULT 0 NOT NULL,
	"volumes_read" integer DEFAULT 0 NOT NULL,
	"total_volumes" integer DEFAULT 0 NOT NULL,
	"is_rereading" boolean DEFAULT false NOT NULL,
	"authors" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE INDEX "anime_list_status_idx" ON "anime" USING btree ("list_status");--> statement-breakpoint
CREATE INDEX "anime_mal_updated_at_idx" ON "anime" USING btree ("mal_updated_at");--> statement-breakpoint
CREATE INDEX "manga_list_status_idx" ON "manga" USING btree ("list_status");--> statement-breakpoint
CREATE INDEX "manga_mal_updated_at_idx" ON "manga" USING btree ("mal_updated_at");
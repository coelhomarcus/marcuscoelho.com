CREATE TABLE "github_pull_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"merged" jsonb NOT NULL,
	"open" jsonb NOT NULL,
	"closed" jsonb NOT NULL,
	"cached_at" timestamp DEFAULT now() NOT NULL
);

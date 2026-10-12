ALTER TABLE "github_stats" ADD COLUMN IF NOT EXISTS "repositories" jsonb NOT NULL DEFAULT '[]'::jsonb;

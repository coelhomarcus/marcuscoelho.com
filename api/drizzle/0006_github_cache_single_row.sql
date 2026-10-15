DELETE FROM "github_contributions" WHERE "id" <> (SELECT max("id") FROM "github_contributions");--> statement-breakpoint
UPDATE "github_contributions" SET "id" = 1;--> statement-breakpoint
DELETE FROM "github_stats" WHERE "id" <> (SELECT max("id") FROM "github_stats");--> statement-breakpoint
UPDATE "github_stats" SET "id" = 1;--> statement-breakpoint
DELETE FROM "github_pull_requests" WHERE "id" <> (SELECT max("id") FROM "github_pull_requests");--> statement-breakpoint
UPDATE "github_pull_requests" SET "id" = 1;

import { env } from "./config/env";
import { app } from "./app";
import cron from "node-cron";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./config/database";
import { migrationsPath } from "./config/paths";
import {
  refreshGitHubContributions,
  refreshGitHubPullRequests,
  refreshGitHubStats,
} from "./modules/github/github.service";
import { refreshAnime, refreshManga } from "./modules/hobbies/hobbies.service";

function refreshWithLogging(
  source: string,
  operation: string,
  refresh: () => Promise<unknown>,
) {
  refresh().catch((error: unknown) => {
    console.error(`[${source}] Failed to refresh ${operation}`, {
      error: error instanceof Error ? error.stack : error,
    });
  });
}

async function startServer() {
  await migrate(db, { migrationsFolder: migrationsPath });

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  cron.schedule("0 */6 * * *", () => {
    if (env.GITHUB_TOKEN) {
      refreshWithLogging("GitHub", "contributions", refreshGitHubContributions);
      refreshWithLogging("GitHub", "stats", refreshGitHubStats);
      refreshWithLogging("GitHub", "pull requests", refreshGitHubPullRequests);
    }
    refreshWithLogging("MyAnimeList", "anime", refreshAnime);
    refreshWithLogging("MyAnimeList", "manga", refreshManga);
  });

  if (env.GITHUB_TOKEN) {
    refreshWithLogging("GitHub", "contributions", refreshGitHubContributions);
    refreshWithLogging("GitHub", "stats", refreshGitHubStats);
    refreshWithLogging("GitHub", "pull requests", refreshGitHubPullRequests);
  } else {
    console.warn("[GitHub] Sync disabled: GITHUB_TOKEN is not configured");
  }
  refreshWithLogging("MyAnimeList", "anime", refreshAnime);
  refreshWithLogging("MyAnimeList", "manga", refreshManga);
}

startServer().catch((error) => {
  console.error("Failed to start the API:", error);
  process.exit(1);
});

import { env } from "./config/env";
import { app } from "./app";
import cron from "node-cron";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./config/database";
import {
  refreshGitHubContributions,
  refreshGitHubStats,
} from "./modules/github/github.service";

function refreshWithLogging(
  operation: string,
  refresh: () => Promise<unknown>,
) {
  refresh().catch((error: unknown) => {
    console.error(`[GitHub] Failed to refresh ${operation}`, {
      error: error instanceof Error ? error.stack : error,
    });
  });
}

async function startServer() {
  await migrate(db, { migrationsFolder: "./drizzle" });

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  // Refresh the GitHub cache every 6 hours
  cron.schedule("0 */6 * * *", () => {
    refreshWithLogging("contributions", refreshGitHubContributions);
    refreshWithLogging("stats", refreshGitHubStats);
  });

  // Initial fetch on startup
  refreshWithLogging("contributions", refreshGitHubContributions);
  refreshWithLogging("stats", refreshGitHubStats);
}

startServer().catch((error) => {
  console.error("Failed to start the API:", error);
  process.exit(1);
});

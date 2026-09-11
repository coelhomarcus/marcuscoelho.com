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
    console.error(`[GitHub] Falha ao atualizar ${operation}`, {
      error: error instanceof Error ? error.stack : error,
    });
  });
}

async function startServer() {
  await migrate(db, { migrationsFolder: "./drizzle" });

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  // Atualiza cache do GitHub a cada 6 horas
  cron.schedule("0 */6 * * *", () => {
    refreshWithLogging("contribuições", refreshGitHubContributions);
    refreshWithLogging("estatísticas", refreshGitHubStats);
  });

  // Busca inicial ao subir o servidor
  refreshWithLogging("contribuições", refreshGitHubContributions);
  refreshWithLogging("estatísticas", refreshGitHubStats);
}

startServer().catch((error) => {
  console.error("Falha ao iniciar a API:", error);
  process.exit(1);
});

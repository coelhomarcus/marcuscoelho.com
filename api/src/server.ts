import { env } from "./config/env";
import { app } from "./app";
import cron from "node-cron";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./config/database";
import {
  refreshGitHubContributions,
  refreshGitHubStats,
} from "./modules/github/github.service";

async function startServer() {
  await migrate(db, { migrationsFolder: "./drizzle" });

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });

  // Atualiza cache do GitHub a cada 6 horas
  cron.schedule("0 */6 * * *", () => {
    refreshGitHubContributions().catch(console.error);
    refreshGitHubStats().catch(console.error);
  });

  // Busca inicial ao subir o servidor
  refreshGitHubContributions().catch(console.error);
  refreshGitHubStats().catch(console.error);
}

startServer().catch((error) => {
  console.error("Falha ao iniciar a API:", error);
  process.exit(1);
});

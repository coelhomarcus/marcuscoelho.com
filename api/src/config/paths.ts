import path from "path";

export const migrationsPath = path.resolve(__dirname, "../../drizzle");
export const webDistPath = path.resolve(__dirname, "../../../web/dist");
export const webIndexPath = path.join(webDistPath, "index.html");

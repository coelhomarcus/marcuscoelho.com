import fs from "fs";
import path from "path";
import compression from "compression";
import express from "express";
import { sql } from "drizzle-orm";
import { env } from "./config/env";
import { db } from "./config/database";
import { webDistPath, webIndexPath } from "./config/paths";
import { contactRouter } from "./modules/contact/contact.routes";
import { githubRouter } from "./modules/github/github.routes";
import { hobbiesRouter } from "./modules/hobbies/hobbies.routes";
import { asyncHandler, errorHandler } from "./shared/errors";

export const app = express();

app.disable("x-powered-by");
app.use(compression());

app.use("/api", express.json());
app.get(
  "/api/health",
  asyncHandler(async (_req, res) => {
    await db.execute(sql`select 1`);
    res.json({ status: "ok" });
  }),
);
app.use("/api/contact", contactRouter);
app.use("/api/github", githubRouter);
app.use("/api/hobbies", hobbiesRouter);
app.use("/api", (_req, res) => {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "API route not found" },
  });
});

const hasWebBuild = fs.existsSync(webIndexPath);

if (!hasWebBuild && env.NODE_ENV === "production") {
  throw new Error(`Frontend build not found at ${webIndexPath}`);
}

if (hasWebBuild) {
  app.use(
    express.static(webDistPath, {
      index: false,
      etag: true,
      setHeaders(res, filePath) {
        const fileName = path.basename(filePath);
        if (fileName === "index.html") {
          res.setHeader("Cache-Control", "no-cache");
          return;
        }

        const isBuildAsset = filePath.startsWith(
          `${path.join(webDistPath, "assets")}${path.sep}`,
        );
        const isHashedAsset =
          isBuildAsset && /-[A-Za-z0-9_-]{8,}\.[^.]+$/.test(fileName);
        res.setHeader(
          "Cache-Control",
          isHashedAsset
            ? "public, max-age=31536000, immutable"
            : "public, max-age=3600, must-revalidate",
        );
      },
    }),
  );

  app.get("/{*splat}", (req, res) => {
    const acceptsHtml = Boolean(req.accepts("html"));
    const isFileRequest =
      req.path.startsWith("/assets/") || path.extname(req.path) !== "";

    if (!acceptsHtml || isFileRequest) {
      res
        .status(404)
        .setHeader("Cache-Control", "no-store")
        .type("text/plain")
        .send("Not found");
      return;
    }

    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(webIndexPath);
  });
}

app.use(errorHandler);

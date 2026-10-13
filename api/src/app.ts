import express from "express";
import cors from "cors";
import { contactRouter } from "./modules/contact/contact.routes";
import { githubRouter } from "./modules/github/github.routes";
import { errorHandler } from "./shared/errors";
import { env } from "./config/env";

const app = express();

app.use(cors({ origin: env.CORS_ORIGINS }));
app.use(express.json());

app.use("/contact", contactRouter);
app.use("/github", githubRouter);
app.use(errorHandler);

export { app };

import { Router } from "express";
import { handleGetContributions, handleGetStats } from "./github.controller";
import { asyncHandler } from "../../shared/errors";

const githubRouter = Router();

githubRouter.get("/contributions", asyncHandler(handleGetContributions));
githubRouter.get("/stats", asyncHandler(handleGetStats));

export { githubRouter };

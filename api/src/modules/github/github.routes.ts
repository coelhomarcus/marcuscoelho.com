import { Router } from "express";
import { handleGetContributions, handleGetStats } from "./github.controller";
import { asyncHandler } from "../../shared/errors";

export const githubRouter = Router();

githubRouter.get("/contributions", asyncHandler(handleGetContributions));
githubRouter.get("/stats", asyncHandler(handleGetStats));

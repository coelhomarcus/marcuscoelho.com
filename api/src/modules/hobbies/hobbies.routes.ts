import { Router } from "express";
import { asyncHandler } from "../../shared/errors";
import { handleGetAnime, handleGetManga } from "./hobbies.controller";

export const hobbiesRouter = Router();

hobbiesRouter.get("/anime", asyncHandler(handleGetAnime));
hobbiesRouter.get("/manga", asyncHandler(handleGetManga));

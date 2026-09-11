import { Router } from "express";
import { handleCreateContact } from "./contact.controller";
import { asyncHandler } from "../../shared/errors";

const contactRouter = Router();

contactRouter.post("/", asyncHandler(handleCreateContact));

export { contactRouter };

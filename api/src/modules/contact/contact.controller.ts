import { Request, Response } from "express";
import { createContactSchema } from "./contact.validation";
import { createContact } from "./contact.service";
import { AppError } from "../../shared/errors";

export async function handleCreateContact(req: Request, res: Response) {
  const parsed = createContactSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      "Invalid request body",
      parsed.error.flatten().fieldErrors,
    );
  }

  const contact = await createContact(parsed.data);

  res.status(201).json(contact);
}

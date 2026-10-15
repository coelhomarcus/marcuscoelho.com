import { db } from "../../config/database";
import { contacts } from "./contact.schema";
import { CreateContactInput } from "./contact.validation";
import { sendContactEmail } from "../../shared/email";

export async function createContact(data: CreateContactInput) {
  const [contact] = await db.insert(contacts).values(data).returning();

  sendContactEmail(data).catch((error: unknown) => {
    console.error("[Contact] Failed to send email", {
      contactId: contact.id,
      error: error instanceof Error ? error.stack : error,
    });
  });

  return contact;
}

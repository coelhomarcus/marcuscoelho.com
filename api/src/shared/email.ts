import { Resend } from "resend";
import { env } from "../config/env";
import { CreateContactInput } from "../modules/contact/contact.validation";

const resend = new Resend(env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(data: CreateContactInput) {
  const { error } = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: data.email,
    subject: `Novo contato de ${data.name}`,
    text: `Nome: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    html: `
      <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
    `,
  });

  if (error) throw new Error(`Resend: ${error.message}`);
}

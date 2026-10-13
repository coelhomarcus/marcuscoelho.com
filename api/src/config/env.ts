import "dotenv/config";
import { z } from "zod";

const DEFAULT_CORS_ORIGINS = [
  "https://marcuscoelho.com",
  "https://www.marcuscoelho.com",
];

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  GITHUB_TOKEN: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  CONTACT_FROM_EMAIL: z.string().min(1),
  CONTACT_TO_EMAIL: z.string().email(),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((value) => {
      const origins = (value ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
      return origins.length > 0 ? origins : DEFAULT_CORS_ORIGINS;
    }),
});

export const env = envSchema.parse(process.env);

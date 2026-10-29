import "dotenv/config";
import { z } from "zod";

const emptyAsUndefined = (value: unknown) => (value === "" ? undefined : value);
const optionalString = z.preprocess(
  emptyAsUndefined,
  z.string().min(1).optional(),
);
const optionalEmail = z.preprocess(
  emptyAsUndefined,
  z.string().email().optional(),
);

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.preprocess(emptyAsUndefined, z.coerce.number().default(3000)),
  DATABASE_URL: z.string().url(),
  GITHUB_TOKEN: optionalString,
  MAL_CLIENT_ID: z.string().min(1),
  MAL_USERNAME: z.string().min(1),
  RESEND_API_KEY: optionalString,
  CONTACT_FROM_EMAIL: optionalString,
  CONTACT_TO_EMAIL: optionalEmail,
});

export const env = envSchema.parse(process.env);

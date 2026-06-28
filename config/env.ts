import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url({ error: "NEXT_PUBLIC_API_URL must be a valid URL" }),
});

function validateEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");

    throw new Error(
      `\n[env] Invalid environment variables:\n${issues}\n\nCheck your .env.local file.\n`,
    );
  }

  return result.data;
}

const _env = validateEnv();

export const env = {
  API_URL: _env.NEXT_PUBLIC_API_URL,
} as const;

import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url({
    error: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL",
  }),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, { error: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required" }),
});

function validateEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
      .join("\n");

    throw new Error(
      `\n[env] Invalid environment variables:\n${issues}\n\nCheck your environment variables.\n`,
    );
  }

  return result.data;
}

const _env = validateEnv();

export const env = {
  SUPABASE_URL: _env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: _env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

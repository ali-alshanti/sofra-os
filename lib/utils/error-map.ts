/**
 * Maps raw Supabase / PostgreSQL / network errors to i18n translation keys.
 * Keys correspond to `common.errors.*` in locales/en|ar/common.json.
 */
export function getErrorKey(err: unknown): string {
  const message = (err instanceof Error ? err.message : String(err)).toLowerCase()

  if (
    message.includes("invalid login credentials") ||
    message.includes("invalid_credentials") ||
    message.includes("email not confirmed") ||
    message.includes("wrong password") ||
    message.includes("incorrect password")
  ) {
    return "errors.invalidCredentials"
  }

  if (
    message.includes("duplicate key") ||
    message.includes("unique constraint") ||
    message.includes("already exists") ||
    message.includes("23505")
  ) {
    return "errors.duplicate"
  }

  if (
    message.includes("permission denied") ||
    message.includes("row-level security") ||
    message.includes("insufficient_privilege") ||
    message.includes("42501")
  ) {
    return "errors.permission"
  }

  if (
    message.includes("failed to fetch") ||
    message.includes("networkerror") ||
    message.includes("network request failed") ||
    message.includes("fetch failed") ||
    message.includes("econnrefused") ||
    message.includes("etimedout")
  ) {
    return "errors.network"
  }

  return "errors.generic"
}

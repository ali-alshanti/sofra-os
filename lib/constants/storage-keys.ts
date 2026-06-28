export const STORAGE_KEYS = {
  THEME: "sofra:theme",
  LANGUAGE: "sofra:language",
  ACCESS_TOKEN: "sofra:access_token",
  REFRESH_TOKEN: "sofra:refresh_token",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

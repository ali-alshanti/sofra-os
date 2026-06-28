import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config/env";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  status: number | null;
  code: string;
}

// ─── Client ──────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
  withCredentials: false,
});

// ─── Request Interceptor ─────────────────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // TODO: Attach access token here when auth is implemented
    // const token = getAccessToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(normalizeError(error)),
);

// ─── Response Interceptor ────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeError(error)),
);

// ─── Error Normalizer ────────────────────────────────────────────────────────

function normalizeError(error: AxiosError): ApiError {
  if (error.code === "ECONNABORTED") {
    return {
      message: "The request timed out. Please try again.",
      status: null,
      code: "TIMEOUT",
    };
  }

  if (!error.response) {
    return {
      message: "Network error. Please check your connection.",
      status: null,
      code: "NETWORK_ERROR",
    };
  }

  const status = error.response.status;
  const data = error.response.data as Record<string, unknown> | undefined;
  const message =
    (typeof data?.message === "string" ? data.message : null) ??
    error.message ??
    "An unexpected error occurred.";

  return { message, status, code: "API_ERROR" };
}

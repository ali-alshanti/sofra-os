import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";

export const metadata: Metadata = {
  title: "Sign In — Sofra OS",
  description: "Sign in to your Sofra Restaurant Operations account.",
};

// Wrapped in Suspense because LoginForm uses useSearchParams()
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

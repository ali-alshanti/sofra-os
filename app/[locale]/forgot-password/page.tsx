"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, UtensilsCrossed } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth";
import { getErrorKey } from "@/lib/utils/error-map";

// ─── Schema ───────────────────────────────────────────────────────────────────

type ForgotPasswordValues = { email: string };

export default function ForgotPasswordPage() {
  const t  = useTranslations("auth.forgotPassword");
  const tv = useTranslations("auth.login.validation");
  const tc = useTranslations("common");

  const schema = z.object({
    email: z.string().min(1, tv("emailRequired")).email(tv("emailInvalid")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- zod's internal
    // core version stamp drifted between zod@4.4.x and @hookform/resolvers@5.4.0's
    // pre-built types (already the latest resolver release); runtime is unaffected.
    resolver: zodResolver(schema as any),
    defaultValues: { email: "" },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent]               = useState(false);
  const [sentEmail, setSentEmail]     = useState("");

  async function onSubmit({ email }: ForgotPasswordValues) {
    setServerError(null);
    try {
      await authService.sendPasswordResetEmail(email);
      setSentEmail(email);
      setSent(true);
    } catch (err) {
      setServerError(tc(getErrorKey(err)));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <div className="rounded-lg border border-primary/30 bg-primary/8 px-4 py-6">
              <p className="text-sm font-medium text-foreground">
                {t("successTitle")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("successMessage", { email: sentEmail })}
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              <ArrowLeft size={14} /> {t("backToLogin")}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3">
                <p className="text-sm text-destructive">{serverError}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="fp-email" className="text-sm font-medium text-foreground">
                {t("email")}
              </label>
              <Input
                id="fp-email"
                type="email"
                placeholder={t("emailPlaceholder")}
                autoComplete="email"
                disabled={isSubmitting}
                aria-invalid={!!errors.email}
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                t("submit")
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> {t("backToLogin")}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

"use client"

import { useTranslations } from "next-intl"
import { toast } from "@/lib/hooks/use-toast"
import { getErrorKey } from "@/lib/utils/error-map"

/**
 * Application-level toast helper.
 * Wraps the shadcn/ui toast with translated success/error helpers.
 */
export function useAppToast() {
  const t = useTranslations("common")

  function toastSuccess(description: string) {
    toast({ description, variant: "success" })
  }

  function toastError(description: string) {
    toast({ description, variant: "destructive" })
  }

  function toastMutationError(err: unknown) {
    const key = getErrorKey(err)
    toastError(t(key))
  }

  return { toastSuccess, toastError, toastMutationError }
}

"use client"

import { CheckCircle, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        const Icon =
          variant === "success"     ? CheckCircle :
          variant === "destructive" ? AlertCircle :
          Info

        const iconClass =
          variant === "success"     ? "text-emerald-600 dark:text-emerald-400" :
          variant === "destructive" ? "text-red-600 dark:text-red-400" :
          "text-blue-600 dark:text-blue-400"

        const barClass =
          variant === "success"     ? "bg-emerald-500" :
          variant === "destructive" ? "bg-red-500" :
          "bg-blue-500"

        return (
          <Toast key={id} variant={variant} {...props}>
            {/* Color bar */}
            <span className={`absolute start-0 top-0 h-full w-1 rounded-s-xl ${barClass}`} />

            {/* Icon */}
            <Icon size={18} className={`mt-0.5 shrink-0 ${iconClass}`} />

            {/* Content */}
            <div className="flex-1 space-y-0.5">
              {title       && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>

            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

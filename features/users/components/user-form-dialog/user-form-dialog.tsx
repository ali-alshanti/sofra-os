"use client";

import { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { FormDialog } from "@/components/shared/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUser, useUpdateUser } from "@/lib/hooks/use-users";
import { ROLE_VALUES, type AppUser } from "@/features/users/types";
import type { UserRole } from "@/types/auth";

// ─── Schema ───────────────────────────────────────────────────────────────────

function useUserSchema(isEdit: boolean) {
  const t = useTranslations("users.validation");

  return z
    .object({
      full_name: z.string().min(1, t("nameRequired")),
      phone: z.string().optional(),
      role: z.enum(ROLE_VALUES as [UserRole, ...UserRole[]], { error: t("roleRequired") }),
      isActive: z.boolean(),
      email: z.string().optional(),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (isEdit) return;

      if (!data.email || !z.string().email().safeParse(data.email).success) {
        ctx.addIssue({ code: "custom", path: ["email"], message: data.email ? t("emailInvalid") : t("emailRequired") });
      }
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({ code: "custom", path: ["password"], message: t("passwordMinLength") });
      }
      if (!data.confirmPassword) {
        ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: t("confirmPasswordRequired") });
      } else if (data.password !== data.confirmPassword) {
        ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: t("passwordsMustMatch") });
      }
    });
}

type UserFormValues = {
  full_name: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, the dialog edits this user instead of creating a new one. */
  user?: AppUser | null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const t = useTranslations("users");
  const ta = useTranslations("common.actions");
  const isEdit = !!user;

  const schema = useUserSchema(isEdit);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserFormValues>({
    // The RHF/Zod dependency pair in this repo pins @hookform/resolvers to a
    // zod v3 peer while the project depends on zod v4; the resulting type
    // mismatch is a version-skew artifact only — runtime behavior is correct.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as Resolver<UserFormValues>,
    defaultValues: {
      full_name: "",
      phone: "",
      role: "Waiter",
      isActive: true,
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        full_name: user?.fullName ?? "",
        phone: user?.phone ?? "",
        role: user?.role ?? "Waiter",
        isActive: user ? user.status === "active" : true,
        email: user?.email ?? "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [open, user, reset]);

  const create = useCreateUser();
  const update = useUpdateUser();
  const pending = create.isPending || update.isPending;

  const role = watch("role");
  const isActive = watch("isActive");

  function onSubmit(values: UserFormValues) {
    if (isEdit && user) {
      update.mutate(
        {
          userId: user.id,
          patch: {
            full_name: values.full_name,
            phone: values.phone,
            role: values.role,
            status: values.isActive ? "active" : "inactive",
          },
        },
        { onSuccess: () => onOpenChange(false) },
      );
      return;
    }

    create.mutate(
      {
        full_name: values.full_name,
        email: values.email!,
        phone: values.phone,
        role: values.role,
        password: values.password!,
        status: values.isActive ? "active" : "inactive",
      },
      { onSuccess: () => onOpenChange(false) },
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? t("edit.title") : t("add.title")}
      description={isEdit ? t("edit.description") : t("add.description")}
      maxWidth="lg"
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={isEdit ? ta("save") : ta("create")}
      cancelLabel={ta("cancel")}
      loading={pending}
    >
      {/* Full name */}
      <div className="grid gap-1.5">
        <Label htmlFor="user-name">{t("table.user")}</Label>
        <Input id="user-name" placeholder={t("add.namePlaceholder")} {...register("full_name")} />
        {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="user-email">{t("table.email")}</Label>
          <Input
            id="user-email"
            type="email"
            placeholder={t("add.emailPlaceholder")}
            disabled={isEdit}
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="user-phone">{t("table.phone")}</Label>
          <Input id="user-phone" type="tel" placeholder={t("add.phonePlaceholder")} {...register("phone")} />
        </div>
      </div>

      {/* Role + Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="user-role">{t("table.role")}</Label>
          <Select value={role} onValueChange={(v) => setValue("role", v as UserRole)}>
            <SelectTrigger id="user-role" className="h-9">
              <SelectValue placeholder={t("add.selectRole")} />
            </SelectTrigger>
            <SelectContent>
              {ROLE_VALUES.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="user-status">{t("table.status")}</Label>
          <div className="flex h-9 items-center gap-2">
            <Switch id="user-status" checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
            <span className="text-sm text-muted-foreground">
              {isActive ? t("status.active") : t("status.inactive")}
            </span>
          </div>
        </div>
      </div>

      {/* Password (create only) */}
      {!isEdit && (
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="user-password">{t("add.password")}</Label>
            <Input id="user-password" type="password" {...register("password")} />
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="user-confirm-password">{t("add.confirmPassword")}</Label>
            <Input id="user-confirm-password" type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
      )}
    </FormDialog>
  );
}

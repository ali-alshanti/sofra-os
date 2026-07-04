"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/app-shell";
import { Pagination } from "@/components/shared/pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { UserHeader } from "./components/user-header";
import { UserFilters } from "./components/user-filters";
import { UserTable } from "./components/user-table";
import { UserFormDialog } from "./components/user-form-dialog";
import { DEFAULT_USER_FILTERS, type UserFiltersValue, type AppUserStatus } from "./types";
import { useUsers, useSetUserStatus } from "@/lib/hooks/use-users";
import { QUERY_KEYS } from "@/lib/constants/query-keys";
import { useAppToast } from "@/lib/hooks/use-app-toast";
import type { UserRole } from "@/types/auth";

const PAGE_SIZE = 10;

export function UsersFeature() {
  const t = useTranslations("users");

  const [filters, setFilters] = useState<UserFiltersValue>(DEFAULT_USER_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [pendingStatusUserId, setPendingStatusUserId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toastSuccess } = useAppToast();

  const { data, isLoading } = useUsers({
    page: currentPage,
    pageSize: PAGE_SIZE,
    search: filters.search || undefined,
    role: filters.role,
    status: filters.status,
  });

  const setStatus = useSetUserStatus();

  const users = data?.users ?? [];
  const totalItems = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const editingUser = editingUserId ? (users.find((u) => u.id === editingUserId) ?? null) : null;
  const pendingStatusUser = pendingStatusUserId ? (users.find((u) => u.id === pendingStatusUserId) ?? null) : null;

  function handleRefresh() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.all });
    toastSuccess(t("toast.refreshed"));
  }

  function handleConfirmStatusToggle() {
    if (!pendingStatusUser) return;
    const nextStatus: AppUserStatus = pendingStatusUser.status === "active" ? "inactive" : "active";
    setStatus.mutate(
      { userId: pendingStatusUser.id, status: nextStatus },
      { onSettled: () => setPendingStatusUserId(null) },
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <UserHeader
          onRefresh={handleRefresh}
          onAddUser={() => {
            setEditingUserId(null);
            setFormOpen(true);
          }}
        />

        <UserFilters
          value={filters}
          disabled={isLoading}
          onSearchChange={(s) => { setFilters((f) => ({ ...f, search: s })); setCurrentPage(1); }}
          onRoleChange={(r) => { setFilters((f) => ({ ...f, role: r as UserRole | "all" })); setCurrentPage(1); }}
          onStatusChange={(s) => { setFilters((f) => ({ ...f, status: s })); setCurrentPage(1); }}
          onClearFilters={() => { setFilters(DEFAULT_USER_FILTERS); setCurrentPage(1); }}
        />

        <UserTable
          users={users}
          loading={isLoading}
          onEdit={(id) => { setEditingUserId(id); setFormOpen(true); }}
          onToggleStatus={(id) => setPendingStatusUserId(id)}
          pagination={
            totalPages > 1 ? (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={PAGE_SIZE}
                itemLabel={t("title").toLowerCase()}
                onPageChange={setCurrentPage}
              />
            ) : undefined
          }
        />

        <UserFormDialog
          open={formOpen}
          onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingUserId(null); }}
          user={editingUser}
        />

        <ConfirmDialog
          open={!!pendingStatusUser}
          onOpenChange={(open) => { if (!open) setPendingStatusUserId(null); }}
          title={pendingStatusUser?.status === "active" ? t("confirm.deactivateTitle") : t("confirm.reactivateTitle")}
          description={pendingStatusUser?.status === "active" ? t("confirm.deactivateDescription") : t("confirm.reactivateDescription")}
          confirmLabel={pendingStatusUser?.status === "active" ? t("confirm.deactivateConfirm") : t("confirm.reactivateConfirm")}
          destructive={pendingStatusUser?.status === "active"}
          loading={setStatus.isPending}
          onConfirm={handleConfirmStatusToggle}
        />
      </div>
    </AppShell>
  );
}

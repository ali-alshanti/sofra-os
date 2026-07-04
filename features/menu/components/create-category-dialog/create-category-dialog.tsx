"use client";

import { useState } from "react";
import { Loader2, FolderPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateMenuCategory } from "@/lib/hooks/use-menu";

interface CreateCategoryDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
  const t  = useTranslations("menu");
  const ta = useTranslations("common.actions");

  const [name, setName] = useState("");
  const create = useCreateMenuCategory();

  function handleClose() {
    setName("");
    onOpenChange(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    create.mutate(name.trim(), { onSuccess: handleClose });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleClose())}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FolderPlus className="size-5" />
          </div>
          <DialogTitle>{t("createCategory.title")}</DialogTitle>
          <DialogDescription>{t("createCategory.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 pt-4">
          <div className="grid gap-1.5">
            <Label htmlFor="cat-name">{t("createCategory.name")}</Label>
            <Input
              id="cat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("createCategory.namePlaceholder")}
              autoFocus
              required
            />
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleClose} disabled={create.isPending}>
              {ta("cancel")}
            </Button>
            <Button type="submit" disabled={create.isPending || !name.trim()}>
              {create.isPending && <Loader2 size={14} className="animate-spin" />}
              {ta("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

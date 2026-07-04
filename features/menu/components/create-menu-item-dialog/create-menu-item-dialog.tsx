"use client";

import { useEffect, useState } from "react";
import { Loader2, UtensilsCrossed } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMenuCategories, useCreateMenuItem, useUpdateMenuItem } from "@/lib/hooks/use-menu";
import type { MenuItem } from "@/features/menu/components/menu-card";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CreateMenuItemDialogProps {
  open:         boolean;
  onOpenChange: (open: boolean) => void;
  defaultCategoryId?: string;
  /** When set, the dialog edits this item instead of creating a new one. */
  editingItem?: MenuItem | null;
}

// ─── Form state ───────────────────────────────────────────────────────────────

interface FormState {
  name:        string;
  description: string;
  price:       string;
  categoryId:  string;
  imageUrl:    string;
  available:   boolean;
}

function emptyForm(defaultCategoryId?: string): FormState {
  return {
    name:        "",
    description: "",
    price:       "",
    categoryId:  defaultCategoryId ?? "",
    imageUrl:    "",
    available:   true,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreateMenuItemDialog({ open, onOpenChange, defaultCategoryId, editingItem }: CreateMenuItemDialogProps) {
  const t  = useTranslations("menu");
  const ta = useTranslations("common.actions");

  const [form, setForm] = useState<FormState>(() => emptyForm(defaultCategoryId));
  const { data: categories = [] } = useMenuCategories();
  const create = useCreateMenuItem();
  const update = useUpdateMenuItem();
  const isEditing = !!editingItem;
  const pending   = create.isPending || update.isPending;

  useEffect(() => {
    if (!open) return;
    if (editingItem) {
      setForm({
        name:        editingItem.name,
        description: editingItem.description,
        price:       String(editingItem.price),
        categoryId:  editingItem.category,
        imageUrl:    editingItem.imageSrc ?? "",
        available:   editingItem.available,
      });
    } else {
      setForm(emptyForm(defaultCategoryId));
    }
  }, [open, editingItem, defaultCategoryId]);

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleClose() {
    onOpenChange(false);
  }

  const price      = Number(form.price);
  const priceValid = form.price !== "" && !Number.isNaN(price) && price > 0;
  const canSubmit  = form.name.trim() !== "" && form.categoryId !== "" && priceValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    if (isEditing && editingItem) {
      update.mutate(
        {
          itemId: editingItem.id,
          patch: {
            name:        form.name.trim(),
            description: form.description.trim(),
            price,
            image_url:   form.imageUrl.trim() || undefined,
            status:      form.available ? "available" : "unavailable",
          },
        },
        { onSuccess: handleClose },
      );
      return;
    }

    create.mutate(
      {
        categoryId:  form.categoryId,
        name:        form.name.trim(),
        description: form.description.trim(),
        price,
        imageUrl:    form.imageUrl.trim(),
        available:   form.available,
      },
      { onSuccess: handleClose },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(o) : handleClose())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center sm:items-center sm:text-center">
          <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UtensilsCrossed className="size-5" />
          </div>
          <DialogTitle>{isEditing ? t("actions.edit") : t("create.title")}</DialogTitle>
          <DialogDescription>{t("create.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 pt-4">
          <div className="grid gap-1.5">
            <Label htmlFor="mi-name">{t("create.name")}</Label>
            <Input
              id="mi-name"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              placeholder={t("create.namePlaceholder")}
              required
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="mi-description">{t("create.description_label")}</Label>
            <textarea
              id="mi-description"
              value={form.description}
              onChange={(e) => patch("description", e.target.value)}
              placeholder={t("create.descriptionPlaceholder")}
              rows={2}
              className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="mi-price">{t("create.price")}</Label>
              <Input
                id="mi-price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => patch("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="mi-category">{t("create.category")}</Label>
              <Select value={form.categoryId} onValueChange={(v) => patch("categoryId", v)}>
                <SelectTrigger id="mi-category" className="h-8 w-full bg-background">
                  <SelectValue placeholder={t("create.categoryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="mi-image">{t("create.imageUrl")}</Label>
            <Input
              id="mi-image"
              value={form.imageUrl}
              onChange={(e) => patch("imageUrl", e.target.value)}
              placeholder={t("create.imageUrlPlaceholder")}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted/30 p-3">
            <Label htmlFor="mi-available" className="cursor-pointer">
              {t("create.available")}
            </Label>
            <Switch
              id="mi-available"
              checked={form.available}
              onCheckedChange={(checked) => patch("available", checked)}
            />
          </div>

          <DialogFooter className="pt-1">
            <Button type="button" variant="outline" onClick={handleClose} disabled={pending}>
              {ta("cancel")}
            </Button>
            <Button type="submit" disabled={pending || !canSubmit}>
              {pending && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? ta("save") : ta("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

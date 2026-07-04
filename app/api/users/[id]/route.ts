import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSupabaseAdminClient, requireUserAdmin } from "@/lib/supabase/admin";

const ROLE_NAMES = [
  "Owner",
  "Manager",
  "Cashier",
  "Waiter",
  "Kitchen Staff",
  "Inventory Manager",
] as const;

const updateUserSchema = z.object({
  full_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  role: z.enum(ROLE_NAMES).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const admin = await requireUserAdmin();
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const parsed = updateUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { full_name, phone, role, status } = parsed.data;

  const supabaseAdmin = getSupabaseAdminClient();

  if (full_name !== undefined || phone !== undefined || status !== undefined) {
    const { error } = await supabaseAdmin
      .from("users")
      .update({
        ...(full_name !== undefined && { full_name }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(status !== undefined && { is_active: status === "active" }),
      })
      .eq("id", id)
      .eq("restaurant_id", admin.restaurantId);
    if (error) return NextResponse.json({ message: error.message }, { status: 400 });
  }

  if (role !== undefined) {
    const { data: roleRow, error: roleError } = await supabaseAdmin
      .from("roles")
      .select("id")
      .eq("name", role)
      .or(`restaurant_id.eq.${admin.restaurantId},restaurant_id.is.null`)
      .single();
    if (roleError || !roleRow) {
      return NextResponse.json({ message: "Role not found." }, { status: 400 });
    }

    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", id)
      .eq("restaurant_id", admin.restaurantId);

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: id, role_id: roleRow.id, restaurant_id: admin.restaurantId });
    if (insertError) return NextResponse.json({ message: insertError.message }, { status: 400 });
  }

  return NextResponse.json({ id });
}

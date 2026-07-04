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

const createUserSchema = z.object({
  full_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(ROLE_NAMES),
  password: z.string().min(6),
  status: z.enum(["active", "inactive"]).default("active"),
});

export async function POST(request: NextRequest) {
  const admin = await requireUserAdmin();
  if (!admin.ok) {
    return NextResponse.json({ message: admin.message }, { status: admin.status });
  }

  const parsed = createUserSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }
  const { full_name, email, phone, role, password, status } = parsed.data;

  const supabaseAdmin = getSupabaseAdminClient();

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !created.user) {
    return NextResponse.json({ message: createError?.message ?? "Failed to create user." }, { status: 400 });
  }

  const { error: profileError } = await supabaseAdmin.from("users").insert({
    id: created.user.id,
    restaurant_id: admin.restaurantId,
    email,
    full_name,
    phone: phone || null,
    is_active: status === "active",
  });
  if (profileError) {
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ message: profileError.message }, { status: 400 });
  }

  const { data: roleRow, error: roleError } = await supabaseAdmin
    .from("roles")
    .select("id")
    .eq("name", role)
    .or(`restaurant_id.eq.${admin.restaurantId},restaurant_id.is.null`)
    .single();
  if (roleError || !roleRow) {
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ message: "Role not found." }, { status: 400 });
  }

  const { error: userRoleError } = await supabaseAdmin.from("user_roles").insert({
    user_id: created.user.id,
    role_id: roleRow.id,
    restaurant_id: admin.restaurantId,
  });
  if (userRoleError) {
    await supabaseAdmin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ message: userRoleError.message }, { status: 400 });
  }

  return NextResponse.json({ id: created.user.id }, { status: 201 });
}

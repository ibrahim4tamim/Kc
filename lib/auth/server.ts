import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AppRole } from "./roles";

export async function getCurrentAuthContext(): Promise<{
  userId: string | null;
  role: AppRole | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { userId: null, role: null };

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return { userId: user.id, role: data?.role ?? null };
}

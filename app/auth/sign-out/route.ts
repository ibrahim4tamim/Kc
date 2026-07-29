import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SIGN_OUT_REDIRECT_PATH } from "@/lib/auth/customer";

export async function POST(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL(SIGN_OUT_REDIRECT_PATH, request.url), 303);
}

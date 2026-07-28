import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "./env";
import type { Database } from "./types";

export function createClient() {
  const { url, publishableKey } = getSupabasePublicConfig();
  return createBrowserClient<Database>(url, publishableKey);
}

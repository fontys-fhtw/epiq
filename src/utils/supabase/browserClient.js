import { ENV_VARS } from "@src/constants";
import { createBrowserClient } from "@supabase/ssr";

export default function createSupabaseBrowserClient() {
  return createBrowserClient(ENV_VARS.SUPABASE_URL, ENV_VARS.SUPABASE_ANON_KEY);
}

/* eslint-disable no-else-return */
import { DEFAULT_VALUES } from "@src/constants";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  const { referral } = params;
  /**
   * The referral is the user id of the user that referred the new user.
   * This is used to track the referral and reward the referrer.
   * We might not implement this feature in the future, but it's good to have it in place.
   */
  if (referral !== DEFAULT_VALUES.REFERRAL) {
    console.info("Referral user id:", referral);
  }

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}customer/`);
      } else if (forwardedHost) {
        return NextResponse.redirect(
          `https://${forwardedHost}${next}customer/`,
        );
      } else {
        return NextResponse.redirect(`${origin}${next}customer/`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

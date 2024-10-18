/* eslint-disable no-else-return */
import { DEFAULT_VALUES } from "@src/constants";
import { addReferral } from "@src/queries/customer";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/";

    if (!code) {
      throw new Error("No auth code provided");
    }

    const supabase = createSupabaseServerClient();
    const { error: authError, data: authData } =
      await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      throw new Error(authError.message);
    }

    const receiver = authData.session.user.id;

    /**
     * The referral is the user id of the user that referred the new user.
     * This is used to track the referral and reward the referrer.
     * Store the referral in the database for future use.
     */
    const { referral } = params;
    if (referral === receiver) {
      throw new Error("Referral and receiver cannot be the same user");
    }
    if (referral !== DEFAULT_VALUES.REFERRAL) {
      const { data, error: referralError } = await addReferral(supabase, {
        giver: referral,
        receiver: authData.session.user.id,
      });
      if (referralError) {
        throw new Error(referralError.message);
      }
      console.log("Referral added:", data);
    }

    const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
    const isLocalEnv = process.env.NODE_ENV === "development";
    if (isLocalEnv) {
      // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
      return NextResponse.redirect(`${origin}${next}customer/`);
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}customer/`);
    } else {
      return NextResponse.redirect(`${origin}${next}customer/`);
    }
  } catch (error) {
    console.error(error);
    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}

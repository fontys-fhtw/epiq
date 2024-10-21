/* eslint-disable no-else-return */
import { DEFAULT_VALUES } from "@src/constants";
import {
  addReferral,
  addUserCredits,
  initializeUserCredits,
} from "@src/queries/customer";
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

    const receiverId = authData.session.user.id;

    // Initialize user credits (unless they already exist)
    const { error: initCreditsError } = await initializeUserCredits(
      supabase,
      receiverId,
    );
    if (initCreditsError) {
      throw new Error(initCreditsError.message);
    }

    /**
     * The referral is the user id of the user that referred the new user.
     * This is used to track the referral and reward the referrer.
     * Store the referral in the database for future use.
     */
    const { referral: referrerId } = params;
    if (referrerId === receiverId) {
      throw new Error("Referrer and receiver cannot be the same user");
    }

    if (referrerId !== DEFAULT_VALUES.REFERRAL) {
      const { data: referralData, error: referralError } = await addReferral(
        supabase,
        {
          referrerId,
          referredUserId: authData.session.user.id,
        },
      );

      if (referralError) {
        throw new Error(referralError.message);
      }

      await addUserCredits(supabase, {
        userId: receiverId,
        amount: referralData.referral_amount,
      });

      await addUserCredits(supabase, {
        userId: referrerId,
        amount: referralData.referral_amount,
      });
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
    return NextResponse.redirect(
      `${origin}/customer/auth?error=${error.message}`,
    );
  }
}

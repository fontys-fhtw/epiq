/* eslint-disable no-else-return */
import { DEFAULT_VALUES, ENV_VARS } from "@src/constants";
import {
  addReferral,
  addUserCredits,
  checkReferralExists,
  initializeUserCredits,
} from "@src/queries/customer";
import { createSupabaseServerClient } from "@src/utils/supabase/serverClient";
import { NextResponse } from "next/server";

function getRedirectUrl(
  request,
  next,
  origin,
  redirectTo = "customer/profile/",
) {
  const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
  const isLocalEnv = ENV_VARS.NODE_ENV === "development";

  if (isLocalEnv) {
    return `${origin}${next}${redirectTo}`;
  }

  if (forwardedHost) {
    return `https://${forwardedHost}${next}${redirectTo}`;
  }

  return `${origin}${next}${redirectTo}`;
}

export async function GET(request, { params }) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const redirectTo = searchParams.get("redirectTo") ?? null;

  if (!code) {
    return NextResponse.redirect(
      `${origin}${next}customer/profile/?error=No auth code provided`,
    );
  }

  const supabase = createSupabaseServerClient();

  try {
    const { data: authData, error: authError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      throw new Error(authError.message);
    }

    const receiverId = authData.session.user.id;

    // Initialize user credits (if not already initialized)
    const { error: initCreditsError } = await initializeUserCredits(
      supabase,
      receiverId,
    );
    if (initCreditsError) {
      throw new Error(initCreditsError.message);
    }

    const { referrerId } = params;

    if (
      referrerId &&
      referrerId !== DEFAULT_VALUES.REFERRAL &&
      referrerId !== receiverId
    ) {
      // Check if referral already exists
      const { data: referralExistsData, error: referralExistsError } =
        await checkReferralExists(supabase, referrerId, receiverId);

      if (referralExistsError) {
        throw new Error(referralExistsError.message);
      }

      if (referralExistsData) {
        throw new Error("You cannot use the same referral link twice.");
      }

      // Add referral
      const { data: referralData, error: referralError } = await addReferral(
        supabase,
        {
          referrerId,
          referredUserId: receiverId,
        },
      );

      if (referralError) {
        throw new Error(referralError.message);
      }

      const referralAmount = referralData.referral_amount;

      // Add credits for both receiver and referrer concurrently
      await Promise.all([
        addUserCredits(supabase, {
          userId: receiverId,
          amount: referralAmount,
        }),
        addUserCredits(supabase, {
          userId: referrerId,
          amount: referralAmount,
        }),
      ]);
    } else if (referrerId === receiverId) {
      throw new Error("Referrer and receiver cannot be the same user");
    }
  } catch (err) {
    console.error(err.message);
    const redirectUrl = `${getRedirectUrl(request, next, origin)}?error=${encodeURIComponent(err.message)}`;
    return NextResponse.redirect(redirectUrl);
  }

  const redirectUrl = getRedirectUrl(request, next, origin, redirectTo);
  return NextResponse.redirect(redirectUrl);
}

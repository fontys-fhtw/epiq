import { NextResponse } from "next/server";

import { supabase } from "./lib/supabaseClient";

// This function can be marked `async` if using `await` inside
export async function middleware(req) {
  const { data: session } = await supabase.auth.getSession();
  const url = req.nextUrl.clone();

  if (!session && url.pathname.startsWith("/customer")) {
    url.pathname = "/customer/signIn";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/customer/:path*"], // Protect all routes under /protected
};

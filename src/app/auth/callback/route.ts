import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { sameSitePath } from "@/lib/safe-next";
import { supabaseServer } from "@/lib/supabase/server";

// Auth links land here, then go on to ?next= (same-site paths only):
// - ?code=…              Google sign-in, and email links in the default (PKCE) flow
// - ?token_hash=…&type=… email links from a custom template (recovery, signup, …), work in any browser
// Add <site>/auth/callback to Supabase → Authentication → URL Configuration → Redirect URLs.

const OTP_TYPES: EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change", "email"];

/** Only paths on this site (lib/safe-next.ts). */
function safeNext(want: string | null) {
  return want === null ? "/admin" : (sameSitePath(want) ?? "/");
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const sb = await supabaseServer();
  if (sb && code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  } else if (sb && tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await sb.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  const fail = new URL(next, url.origin);
  fail.searchParams.set("auth", "failed");
  return NextResponse.redirect(fail);
}

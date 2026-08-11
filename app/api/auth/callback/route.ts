import { NextRequest, NextResponse } from "next/server";
import { createInsforgeAuthActions } from "@/lib/insforge-server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("insforge_code");
  const verifier = request.cookies.get("insforge_code_verifier")?.value;

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", request.url));
  }

  const auth = await createInsforgeAuthActions();
  const { data, error } = await auth.exchangeOAuthCode(code, verifier);

  if (error || !data) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error?.message || "Exchange failed")}`, request.url)
    );
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.delete("insforge_code_verifier");
  return response;
}

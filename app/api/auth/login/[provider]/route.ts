import { NextRequest, NextResponse } from "next/server";
import { createInsforgeAuthActions } from "@/lib/insforge-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const resolvedParams = await params;
    const provider = resolvedParams?.provider;

    if (provider !== "google" && provider !== "github") {
      return new NextResponse("Invalid OAuth provider", { status: 400 });
    }

    const auth = await createInsforgeAuthActions();
    const redirectTo = `${new URL(request.url).origin}/api/auth/callback`;

    const { data, error } = await auth.signInWithOAuth(provider, {
      redirectTo,
      skipBrowserRedirect: true,
    });

    if (error || !data?.url) {
      console.error("[api/auth/login] signInWithOAuth error:", error);
      return new NextResponse(error?.message || "Failed to start OAuth flow", { status: 500 });
    }

    const response = NextResponse.redirect(data.url);

    // If PKCE code verifier is returned, store it in a secure httpOnly cookie
    if (data.codeVerifier) {
      response.cookies.set("insforge_code_verifier", data.codeVerifier, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 600, // 10 minutes
      });
    }

    return response;
  } catch (err) {
    console.error("[api/auth/login] Route exception:", err);
    return new NextResponse(
      err instanceof Error ? err.message : "Internal Auth Server Error",
      { status: 500 }
    );
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";

export async function proxy(request: NextRequest) {
  // Create the default next response
  const response = NextResponse.next();

  // Create adapters to bridge Next.js cookies to the InsForge CookieStore interface
  const requestCookiesAdapter = {
    get: (name: string) => {
      const cookie = request.cookies.get(name);
      return cookie ? cookie.value : undefined;
    },
    set: () => {},
    delete: () => {},
  };

  const responseCookiesAdapter = {
    get: (name: string) => {
      const cookie = response.cookies.get(name);
      return cookie ? cookie.value : undefined;
    },
    set: (name: string, value: string, options?: any) => {
      response.cookies.set(name, value, options);
    },
    delete: (name: string) => {
      response.cookies.delete(name);
    },
  };

  // Update session: this reads refresh cookies, contacts the backend if needed,
  // and sets updated cookies on the response object.
  const { accessToken } = await updateSession({
    requestCookies: requestCookiesAdapter as any,
    responseCookies: responseCookiesAdapter as any,
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
  });

  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/find-jobs");

  const isAuthRoute = pathname.startsWith("/login");

  // Redirect checks
  if (isProtectedRoute && !accessToken) {
    const redirectResponse = NextResponse.redirect(new URL("/login", request.url));
    // Copy the updated cookies to the redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  if (isAuthRoute && accessToken) {
    const redirectResponse = NextResponse.redirect(new URL("/dashboard", request.url));
    // Copy the updated cookies to the redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes run freely)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};

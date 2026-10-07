"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import posthog from "posthog-js";
import { insforge } from "@/lib/insforge-client";
import { signOutAction } from "@/actions/auth";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await insforge.auth.getCurrentUser();
      const currentUser = data?.user || null;

      if (currentUser && posthog.get_distinct_id() !== currentUser.id) {
        if (posthog.get_property("$user_id")) {
          posthog.reset();
        }
        posthog.identify(currentUser.id, {
          email: currentUser.email,
          name: currentUser.profile?.name,
          role: "authenticated",
        });
      }

      setIsAuthenticated(Boolean(currentUser));
      setLoading(false);
    };

    fetchUser();
  }, [pathname]);

  const handleSignOut = async () => {
    const result = await signOutAction();

    if ("success" in result) {
      posthog.capture("user_signed_out");
      posthog.reset();
      setIsAuthenticated(false);
      router.push("/");
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 h-20 min-h-20 shrink-0 w-full border-b border-border bg-surface px-6 sm:px-8">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-[10px] bg-linear-to-tr from-accent to-accent-dark shadow-sm transition-transform group-hover:scale-105">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-foreground"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-xl font-bold leading-none text-text-darkest tracking-tight">
            JobPilot
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/dashboard"
            className={`text-sm font-medium leading-5 transition-colors ${
              isActive("/dashboard")
                ? "text-accent"
                : "text-text-dark hover:text-accent"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/find-jobs"
            className={`text-sm font-medium leading-5 transition-colors ${
              isActive("/find-jobs")
                ? "text-accent"
                : "text-text-dark hover:text-accent"
            }`}
          >
            Find Jobs
          </Link>
          <Link
            href="/profile"
            className={`text-sm font-medium leading-5 transition-colors ${
              isActive("/profile")
                ? "text-accent"
                : "text-text-dark hover:text-accent"
            }`}
          >
            Profile
          </Link>
        </nav>

        {/* Action Button */}
        <div className="min-w-[120px] flex justify-end">
          {!loading && (
            isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium leading-5 text-text-primary hover:bg-surface-secondary transition-colors shadow-sm cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-medium leading-5 text-accent-foreground hover:bg-accent-dark transition-colors shadow-sm"
              >
                Start for free
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}

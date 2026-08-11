"use client";

import Link from "next/link";
import posthog from "posthog-js";

export function CallToAction() {
  const captureCtaClick = (cta: "get_started" | "find_first_match") => {
    posthog.capture("landing_cta_clicked", {
      cta,
      placement: "closing_section",
    });
  };
  return (
    <section className="relative overflow-hidden bg-background py-20 px-6 sm:px-8 border-b border-border">
      {/* Background Gradient Mesh (matching Hero, compliant with tokens) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-radial from-accent-light/40 to-transparent blur-3xl" />
        <div className="absolute top-[10%] -right-[10%] h-[500px] w-[500px] rounded-full bg-radial from-info-light/40 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] flex flex-col items-center text-center">
        {/* Title */}
        <h2 className="max-w-3xl text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
          Your next job search can feel a lot less overwhelming
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-xl text-sm sm:text-base font-medium text-text-secondary leading-relaxed">
          Set up your profile, upload your resume, and start finding matches in
          minutes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <Link
            href="/login"
            onClick={() => captureCtaClick("get_started")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-overlay-dark px-6 py-3.5 text-sm font-semibold text-accent-foreground hover:bg-opacity-95 transition-all shadow-md"
          >
            Get Started
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-accent-foreground"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </Link>
          <Link
            href="/login"
            onClick={() => captureCtaClick("find_first_match")}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-surface border border-border px-6 py-3.5 text-sm font-semibold text-text-primary hover:bg-surface-secondary transition-all shadow-xs"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}

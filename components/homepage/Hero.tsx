"use client";

import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

export function Hero() {
  const captureCtaClick = (cta: "get_started" | "find_first_match") => {
    posthog.capture("landing_cta_clicked", {
      cta,
      placement: "hero",
    });
  };
  return (
    <section className="relative overflow-hidden bg-background pt-16 pb-20 px-6 sm:px-8">
      {/* Background Gradient Mesh (compliant with no-hardcoded-hex rule) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div className="absolute -top-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-radial from-accent-light/40 to-transparent blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-radial from-info-light/40 to-transparent blur-3xl" />
        <div className="absolute -bottom-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-radial from-success-light/30 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] flex flex-col items-center text-center">
        {/* Title */}
        <h1 className="max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-tight sm:leading-none">
          Job hunting is hard.
          <span className="block mt-2 sm:mt-4">Your tools shouldn't be.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg font-medium text-text-secondary leading-relaxed">
          Stop applying blind. JobPilot finds the jobs, researches the companies, and
          gives you everything you need to stand out.
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

        {/* Floating Browser Mockup (Source image already contains the browser frame) */}
        <div className="mt-16 w-full max-w-[1024px] rounded-xl border border-border bg-surface shadow-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
          <Image
            src="/images/dashboard-demo.png"
            alt="JobPilot Dashboard Preview"
            width={1024}
            height={640}
            priority
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}

"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import { MissingField } from "@/types";

interface ProfileAttentionBannerProps {
  completionPercentage?: number;
  missingFields?: MissingField[];
}

export function ProfileAttentionBanner({
  completionPercentage = 0,
  missingFields = [],
}: ProfileAttentionBannerProps) {
  // SVG circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, completionPercentage)) / 100) * circumference;

  const isFull = completionPercentage >= 100 && missingFields.length === 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
      <div className="space-y-3 max-w-xl">
        <div className="flex items-center gap-2">
          {isFull ? (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-warning shrink-0 fill-warning/20" />
          )}
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            {isFull ? "Profile is complete" : "Profile needs attention"}
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-medium text-text-secondary leading-relaxed">
          {isFull
            ? "Your profile is fully configured and ready for intelligent job matching and company research."
            : "Complete the following fields to improve your chances of getting quality resumes and accurate job match scores."}
        </p>
        {!isFull && missingFields.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {missingFields.map((field) => (
              <span
                key={field}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider text-white bg-warning uppercase shadow-2xs"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Progress Donut Gauge */}
      <div className="relative shrink-0 flex items-center justify-center self-center sm:self-auto">
        <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke={isFull ? "var(--color-success, #10b981)" : "var(--color-accent, #7c5cfc)"}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <span className="absolute text-xl font-bold text-text-primary">
          {completionPercentage}%
        </span>
      </div>
    </div>
  );
}

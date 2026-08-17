"use client";

import { AlertCircle } from "lucide-react";

interface ProfileAttentionBannerProps {
  completionPercentage?: number;
  missingFields?: string[];
}

export function ProfileAttentionBanner({
  completionPercentage = 70,
  missingFields = ["PHONE", "LOCATION", "EDUCATION"],
}: ProfileAttentionBannerProps) {
  // SVG circular progress math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
      <div className="space-y-3 max-w-xl">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-warning shrink-0 fill-warning/20" />
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            Profile needs attention
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-medium text-text-secondary leading-relaxed">
          Complete the following fields to improve your chances of getting quality resumes.
        </p>
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
      </div>

      {/* 70% Progress Donut Gauge (Purple) */}
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
            stroke="var(--color-accent, #7c5cfc)"
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

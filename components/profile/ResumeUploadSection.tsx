"use client";

import { Upload, FileText } from "lucide-react";

export function ResumeUploadSection() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text-primary">Resume</h2>
        <p className="text-xs sm:text-sm font-medium text-text-secondary mt-1">
          Upload an existing resume to auto-fill the profile, or generate a new tailored one from your details below.
        </p>
      </div>

      {/* Drag and drop zone */}
      <div className="border-2 border-dashed border-border-muted hover:border-accent/40 bg-surface-secondary/60 rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3 transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-full bg-accent-light/60 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
          <Upload className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-text-primary">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-text-muted">
            PDF formatting only. Maximum file size 5MB.
          </p>
        </div>
        <button
          type="button"
          className="mt-2 bg-surface border border-border text-text-primary hover:bg-surface-secondary text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors cursor-pointer"
        >
          Select Resume
        </button>
      </div>

      {/* Generate resume bottom bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-3">
        <span className="text-xs sm:text-sm font-medium text-text-secondary">
          Need a fresh document based on the fields below?
        </span>
        <button
          type="button"
          className="bg-accent hover:bg-accent-dark text-accent-foreground text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          Generate Resume from Profile
        </button>
      </div>
    </div>
  );
}

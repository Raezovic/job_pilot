"use client";

import { useState, useRef, useTransition, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { uploadResumeAction } from "@/actions/profile";

interface ResumeUploadSectionProps {
  resumePdfUrl?: string | null;
}

export function ResumeUploadSection({ resumePdfUrl }: ResumeUploadSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(resumePdfUrl ?? null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!file) return;

    if (!file.type.includes("pdf") && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Please upload a PDF document (.pdf).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB maximum size limit.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    startTransition(async () => {
      const result = await uploadResumeAction(formData);
      if (result.success && result.resumeUrl) {
        setCurrentUrl(result.resumeUrl);
        setSuccessMessage("Resume uploaded successfully.");
      } else {
        setErrorMessage(result.error || "Failed to upload resume.");
      }
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // reset input value so re-selecting same file triggers change
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-xs space-y-6">
      <div>
        <h2 className="text-lg font-bold text-text-primary">Resume</h2>
        <p className="text-xs sm:text-sm font-medium text-text-secondary mt-1">
          Upload an existing resume to auto-fill your profile, or generate a new tailored one from your details below.
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isPending && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center space-y-3 transition-colors cursor-pointer group ${
          isDragging
            ? "border-accent bg-accent-muted"
            : "border-border-muted hover:border-accent/40 bg-surface-secondary/60"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-accent-light/60 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
          ) : (
            <Upload className="w-5 h-5 stroke-[2.5]" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-text-primary">
            {isPending ? "Uploading resume..." : "Click to upload or drag and drop"}
          </p>
          <p className="text-xs text-text-muted">
            PDF formatting only. Maximum file size 5MB.
          </p>
        </div>
        <button
          type="button"
          disabled={isPending}
          className="mt-2 bg-surface border border-border text-text-primary hover:bg-surface-secondary text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Processing..." : "Select Resume"}
        </button>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-xs font-semibold text-error bg-error/10 border border-error/20 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 text-xs font-semibold text-success-darker bg-success-lightest border border-success-light p-3 rounded-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Active Resume Indicator */}
      {currentUrl && (
        <div className="flex items-center justify-between bg-surface-secondary border border-border p-3.5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-light flex items-center justify-center text-accent">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-text-primary">Current Active Resume</p>
              <p className="text-[11px] text-text-muted truncate max-w-[280px] sm:max-w-md">
                resume.pdf
              </p>
            </div>
          </div>
          <a
            href="/api/resume/view"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-accent-dark transition-colors px-3 py-1.5 rounded-md hover:bg-accent-muted"
          >
            <span>View PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

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

export const ResumeSection = ResumeUploadSection;

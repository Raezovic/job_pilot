# Memory — AI Profile Extraction & Storage Pipeline (Feature 07)

Last updated: 2026-09-29T15:09:00+03:00

## What was built

- **AI Profile Extraction from Resume** ([actions/profile.ts](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/actions/profile.ts)):
  - Implemented `extractProfileFromResumeAction` using `pdf-parse` v2 to extract text from stored resumes and Groq (`openai/gpt-oss-120b`) / OpenAI (`gpt-4o`) to extract structured profile JSON schema.
- **Client Auto-Fill Architecture** ([components/profile/ProfilePageClient.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/profile/ProfilePageClient.tsx)):
  - Built `ProfilePageClient` wrapper using `useImperativeHandle` on `ProfileForm` so extracted resume data populates form state for user review without immediately persisting unvalidated data to Postgres.
- **InsForge Storage & Network Optimizations** ([lib/insforge-server.ts](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/lib/insforge-server.ts)):
  - Implemented `createInsforgeAdmin()` factory for server actions to execute storage uploads, downloads, and signed-URL creation via administrative privileges.
  - Implemented an `undici` agent enforcing IPv4 DNS lookups (`family: 4`) on all Node.js server fetches, resolving AWS S3 presigned POST connection timeouts caused by local DNS64/NAT64 configurations.
- **Hydration Fixes** ([app/layout.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/app/layout.tsx)):
  - Added `suppressHydrationWarning` to `<html>` and `<body>` to ignore attribute injections from browser extensions (e.g., Grammarly).

## Decisions made

- Switched AI parsing to Groq API (`GROK_API_KEY` / `GROQ_API_KEY`) using `openai/gpt-oss-120b` for 100% free, ultra-fast structured JSON extraction, with graceful fallback to `OPENAI_API_KEY`.
- Dynamically imported `pdf-parse` within `extractProfileFromResumeAction` and bound `pdfjs.GlobalWorkerOptions.workerSrc` directly to disk via `pathToFileURL` to avoid Next.js Server Action worker bundling crashes.
- Configured Node server runtime `undici` dispatcher globally in `lib/insforge-server.ts` to prevent IPv6 DNS synthesis timeouts to AWS S3.

## Problems solved

- **Grammarly Hydration Mismatch**: Resolved `data-new-gr-c-s-check-loaded` mismatch on `<body>` with `suppressHydrationWarning`.
- **SSR Native Module Crashes**: Prevented top-level `@napi-rs/canvas` / PDFParse crashes by deferring module loading until extract action execution.
- **PDF.js Web Worker Not Found**: Explicitly resolved `pdf.worker.mjs` path on disk with `pathToFileURL`.
- **InsForge Presigned S3 500 STORAGE_ERROR**: Fixed DNS64 IPv6 connection timeouts to AWS S3 by enforcing IPv4 resolution in Node server runtime.
- **OpenAI 429 Insufficient Quota**: Integrated Groq API as the zero-cost default engine for resume extraction.

## Current state

- Feature 07 (AI Profile Extraction from Resume) is fully functional, tested, and verified end-to-end.
- Resume upload, S3 storage, text extraction, and form auto-population work with zero errors.
- Code is committed and pushed to `origin/main`.

## Next session starts with

- **Feature 08 — Resume PDF Generation from Profile**:
  - Implement `/api/resume/generate` route.
  - Read profile data, generate professional resume bullet points, render clean single-page PDF with `@react-pdf/renderer` or equivalent, and upload to InsForge Storage `resumes/{user_id}/resume.pdf`.

## Open questions

- None.

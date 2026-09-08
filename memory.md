# Memory — Profile Save Logic (Feature 06)

Last updated: 2026-09-08T12:05:00+03:00

## What was built

- **Server Actions for Profile & Resume** ([actions/profile.ts](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/actions/profile.ts)):
  - `saveProfileAction` / `saveProfile`: Saves all profile sections (Personal Info, Professional Info, Work Experience, Education, Preferences) into `profiles` via `.upsert(...)`, derives completeness, and triggers PostHog `profile_completed` on initial completion.
  - `uploadResumeAction` / `uploadResume`: Validates PDF format ($\le$ 5MB), converts files to in-memory buffers to support presigned S3 uploads, uploads to InsForge private bucket `resumes/{user.id}/resume.pdf`, and points `resume_pdf_url` to the authenticated view route.
- **Completeness Utility** ([lib/profile-utils.ts](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/lib/profile-utils.ts)):
  - `calculateCompletion` / `calculateProfileCompleteness`: Computes dynamic completion percentage, `isComplete`, and typed `MissingField[]` list.
  - Tolerant parsing for `years_experience` supporting both raw numbers and formatted strings (e.g. `"4"`, `"4 years"`).
- **Authenticated Resume Viewer Route** ([app/api/resume/view/route.ts](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/app/api/resume/view/route.ts)):
  - Generates time-limited signed download URLs (`createSignedUrl(storagePath, 3600)`) for authenticated users, solving 401 Unauthorized errors on private bucket objects.
- **Profile UI Components**:
  - [app/profile/page.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/app/profile/page.tsx): Server-hydrates `ProfileForm`, `ResumeUploadSection`, and `ProfileAttentionBanner` with live DB data.
  - [components/profile/ProfileForm.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/profile/ProfileForm.tsx): Full multi-role work experience management, skills/industries tags, education, preferences, pending spinner, and success/error alerts.
  - [components/profile/ResumeUploadSection.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/profile/ResumeUploadSection.tsx): Direct PDF upload with drag-and-drop and link to view active resume via `/api/resume/view`.
  - [components/profile/ProfileAttentionBanner.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/profile/ProfileAttentionBanner.tsx): Dynamic donut gauge and missing field tags with 100% complete state.
- **Route Protection** ([proxy.ts](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/proxy.ts)):
  - Added `/profile` to `isProtectedRoute`.

## Decisions made

- `profiles` records are written via `.upsert(...)` with `id: user.id` to guarantee creation/update even if OAuth signup triggers were bypassed.
- Private storage bucket `resumes` objects are viewed via `/api/resume/view`, which validates user session on Next.js server and issues signed URLs.
- Next.js Server Action uploads convert multipart files into `Blob` buffers in memory before calling InsForge Storage SDK to ensure compatibility with presigned S3 POST uploads.

## Current state

- Feature 06 (Profile Save Logic) is fully working, tested, and verified.
- Resume upload and private PDF viewing work with zero auth or presigned upload errors.
- TypeScript compiler (`npx tsc --noEmit`) and Next.js build (`npm run build`) pass cleanly with 0 errors.

## Next session starts with

- **Feature 07 — AI Profile Extraction from Resume**: Implement `pdf-parse` text extraction and GPT-4o structured field parsing to auto-populate the profile form when an existing resume is uploaded.

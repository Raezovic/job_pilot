# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 2 — Profile Page
**Last completed:** 06 Profile Save Logic
**Next:** 07 AI Profile Extraction from Resume

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [x] 05 Profile Page — Full UI
- [x] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- Integrated `@insforge/sdk` using the recommended `@insforge/sdk/ssr` entry point.
- Created server-side OAuth start routes (`/api/auth/login/[provider]`) and callback exchange route (`/api/auth/callback`) to securely handle credentials and store PKCE verifiers in secure cookies.
- Added token refresh (`/api/auth/refresh`) and logout (`/api/auth/logout`) API routes.
- Configured Next.js 16 route protection in `proxy.ts` using custom cookie store adapters to bridge requests/responses with the SDK session.
- Added minimal protected page placeholders for `/dashboard`, `/profile`, and `/find-jobs` with server-side session checks.
- PostHog initialized via `instrumentation-client.ts` (Next.js instrumentation hook). Components call posthog-js directly.
- InsForge MCP server added to IDE `settings.json` using `NEXT_PUBLIC_INSFORGE_URL` and `NEXT_PUBLIC_INSFORGE_API`.
- Database schema applied directly via InsForge MCP `run-raw-sql` (no migration files created or kept in project).
- `profiles.id` equals `auth.users.id` (no separate user_id). All FKs use ON DELETE CASCADE except `jobs.run_id` (SET NULL).
- DB trigger `handle_new_user` auto-creates profile row on every OAuth signup — no app code needed.
- DB trigger `set_updated_at` auto-manages `profiles.updated_at` — app code never sets it.
- RLS enabled on all four tables scoped to `auth.uid()`. Storage bucket `resumes` created as private via InsForge MCP `create-bucket`.
- TypeScript types for all DB tables defined in `types/index.ts`.
- Profile mutations wired via Server Action `saveProfileAction` in `actions/profile.ts`, with revalidation of `/profile` and `/dashboard`.
- Profile completeness derived via `calculateProfileCompleteness` in `lib/profile-utils.ts` and synced on every save.
- Resume uploads handled via Server Action `uploadResumeAction` in `actions/profile.ts`, validated for PDF mime type and 5MB limit, stored in InsForge Storage `resumes/{user.id}/resume.pdf` with `upsert: true`.
- PostHog `profile_completed` event triggered server-side on first transition to complete status.

---

## Notes

- Initialized globals.css with the design tokens from ui-tokens.md using Tailwind v4 theme syntax.
- Updated root layout to use Inter font and setup JobPilot metadata.

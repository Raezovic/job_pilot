# Memory — Database Schema (Feature 04)

Last updated: 2026-08-11T13:24:00+03:00

## What was built

- **InsForge MCP Server Configuration** — Registered InsForge official MCP server (`@insforge/mcp`) in `settings.json` using `NEXT_PUBLIC_INSFORGE_URL` and `NEXT_PUBLIC_INSFORGE_API`.
- **Database Schema Execution via MCP** — Executed all 25 DDL statements directly against InsForge PostgreSQL via MCP `run-raw-sql`:
  - `profiles` table — `id` = `auth.users.id` (PK). All user profile columns.
  - `agent_runs` table — tracks each Find Jobs agent run.
  - `jobs` table — all job data including `company_research` jsonb column.
  - `agent_logs` table — append-only log entries per run.
  - `handle_new_user` trigger — auto-creates profile row on OAuth signup.
  - `set_updated_at` trigger — auto-manages `profiles.updated_at`.
  - RLS policies on all four tables (scoped to `auth.uid()`).
- **Private Storage Bucket** — Created `'resumes'` bucket via InsForge MCP `create-bucket`.
- **`types/index.ts`** — TypeScript interfaces: `Profile`, `Job`, `AgentRun`, `AgentLog`, `CompanyResearch`, `WorkExperienceEntry`, `Education` + all union type aliases. Zero migration files left in project.

## Decisions made

- `profiles.id` = same UUID as `auth.users.id` — no separate `user_id` column on profiles.
- All FK deletes use `ON DELETE CASCADE` except `jobs.run_id` which uses `ON DELETE SET NULL` (jobs survive if their agent_run is deleted).
- `handle_new_user` DB trigger handles profile creation — OAuth callback route never needs to upsert a profile.
- `set_updated_at` Postgres trigger handles `updated_at` — app code never sets it manually.
- RLS: `profiles` (SELECT/INSERT/UPDATE), `agent_runs` (SELECT/INSERT), `jobs` (SELECT/INSERT/UPDATE), `agent_logs` (SELECT/INSERT).
- Executed via InsForge MCP — zero migration files stored in repository.

## Current state

- Database schema fully created on InsForge live instance.
- Storage bucket `resumes` created.
- `types/index.ts` ready.

## Next session starts with

- **Feature 05 — Profile Page Full UI**: Build the complete profile form UI with mock data. No save logic yet.

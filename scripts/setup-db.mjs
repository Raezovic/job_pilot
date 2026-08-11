// One-time DB setup script — run with: node scripts/setup-db.mjs
// Reads env vars from .env.local and applies the full schema via the InsForge management API.
// Delete this file after running if desired.

import { readFileSync } from "fs";
import { resolve } from "path";

// Parse .env.local manually (no dotenv dep needed)
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    }),
);

const BASE_URL = env["NEXT_PUBLIC_INSFORGE_URL"];
const API_KEY = env["NEXT_PUBLIC_INSFORGE_API"];

if (!BASE_URL || !API_KEY) {
  console.error(
    "❌ Missing NEXT_PUBLIC_INSFORGE_URL or NEXT_PUBLIC_INSFORGE_API in .env.local",
  );
  process.exit(1);
}

// ============================================================
// All DDL statements — run in order
// ============================================================
const statements = [
  // Extensions
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,

  // profiles table
  `CREATE TABLE IF NOT EXISTS public.profiles (
    id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name           text,
    email               text,
    phone               text,
    location            text,
    current_title       text,
    experience_level    text        CHECK (experience_level IN ('junior', 'mid', 'senior', 'lead')),
    years_experience    integer,
    skills              text[]      NOT NULL DEFAULT '{}',
    industries          text[]      NOT NULL DEFAULT '{}',
    work_experience     jsonb       NOT NULL DEFAULT '[]',
    education           jsonb,
    job_titles_seeking  text[]      NOT NULL DEFAULT '{}',
    remote_preference   text        CHECK (remote_preference IN ('remote', 'onsite', 'hybrid', 'any')),
    preferred_locations text[]      NOT NULL DEFAULT '{}',
    salary_expectation  text,
    cover_letter_tone   text        CHECK (cover_letter_tone IN ('formal', 'casual', 'enthusiastic')),
    linkedin_url        text,
    portfolio_url       text,
    work_authorization  text        CHECK (work_authorization IN ('citizen', 'permanent_resident', 'visa_required')),
    resume_pdf_url      text,
    is_complete         boolean     NOT NULL DEFAULT false,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now()
  )`,

  // agent_runs table
  `CREATE TABLE IF NOT EXISTS public.agent_runs (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status              text        NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
    job_title_searched  text,
    location_searched   text,
    jobs_found          integer     NOT NULL DEFAULT 0,
    started_at          timestamptz NOT NULL DEFAULT now(),
    completed_at        timestamptz
  )`,

  // jobs table
  `CREATE TABLE IF NOT EXISTS public.jobs (
    id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id              uuid        REFERENCES public.agent_runs(id) ON DELETE SET NULL,
    user_id             uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    source              text        NOT NULL CHECK (source IN ('search', 'url')),
    source_url          text,
    external_apply_url  text,
    title               text,
    company             text,
    location            text,
    salary              text,
    job_type            text        CHECK (job_type IN ('fulltime', 'parttime', 'contract')),
    about_role          text,
    responsibilities    text[]      NOT NULL DEFAULT '{}',
    requirements        text[]      NOT NULL DEFAULT '{}',
    nice_to_have        text[]      NOT NULL DEFAULT '{}',
    benefits            text[]      NOT NULL DEFAULT '{}',
    about_company       text,
    match_score         integer     CHECK (match_score >= 0 AND match_score <= 100),
    match_reason        text,
    matched_skills      text[]      NOT NULL DEFAULT '{}',
    missing_skills      text[]      NOT NULL DEFAULT '{}',
    company_research    jsonb,
    found_at            timestamptz NOT NULL DEFAULT now()
  )`,

  // agent_logs table
  `CREATE TABLE IF NOT EXISTS public.agent_logs (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id      uuid        REFERENCES public.agent_runs(id) ON DELETE CASCADE,
    user_id     uuid        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message     text        NOT NULL,
    level       text        NOT NULL CHECK (level IN ('info', 'success', 'warning', 'error')),
    job_id      uuid        REFERENCES public.jobs(id) ON DELETE SET NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
  )`,

  // set_updated_at trigger function
  `CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql`,

  // Drop and create profiles_updated_at trigger
  `DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles`,
  `CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at()`,

  // handle_new_user trigger function
  `CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, created_at, updated_at)
    VALUES (NEW.id, NEW.email, now(), now())
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER`,

  // Drop and create on_auth_user_created trigger
  `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`,
  `CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user()`,

  // Enable RLS
  `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY`,

  // profiles RLS policies
  `CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id)`,
  `CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)`,
  `CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)`,

  // agent_runs RLS policies
  `CREATE POLICY "agent_runs_select_own" ON public.agent_runs FOR SELECT USING (auth.uid() = user_id)`,
  `CREATE POLICY "agent_runs_insert_own" ON public.agent_runs FOR INSERT WITH CHECK (auth.uid() = user_id)`,

  // jobs RLS policies
  `CREATE POLICY "jobs_select_own" ON public.jobs FOR SELECT USING (auth.uid() = user_id)`,
  `CREATE POLICY "jobs_insert_own" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = user_id)`,
  `CREATE POLICY "jobs_update_own" ON public.jobs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`,

  // agent_logs RLS policies
  `CREATE POLICY "agent_logs_select_own" ON public.agent_logs FOR SELECT USING (auth.uid() = user_id)`,
  `CREATE POLICY "agent_logs_insert_own" ON public.agent_logs FOR INSERT WITH CHECK (auth.uid() = user_id)`,
];

// Storage bucket — separate because it's not a Postgres statement
const storageBucketPayload = {
  id: "resumes",
  name: "resumes",
  public: false,
};

async function runSql(sql) {
  // Try the management API SQL endpoint
  const endpoints = [
    `${BASE_URL}/management/v1/sql`,
    `${BASE_URL}/api/v1/admin/sql`,
    `${BASE_URL}/admin/v1/sql`,
  ];

  for (const url of endpoints) {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (res.status !== 404) {
      const text = await res.text();
      if (!res.ok) {
        let parsed;
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = text;
        }
        // Policy already exists is OK
        const msg =
          typeof parsed === "object"
            ? JSON.stringify(parsed)
            : String(parsed);
        if (msg.includes("already exists")) return { ok: true, skipped: true };
        return { ok: false, error: msg };
      }
      return { ok: true };
    }
  }

  return { ok: false, error: "No valid management SQL endpoint found at any tried URL" };
}

async function createStorageBucket() {
  // Try REST API for storage bucket creation
  const url = `${BASE_URL}/storage/v1/bucket`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(storageBucketPayload),
  });
  const text = await res.text();
  if (!res.ok) {
    if (text.includes("already exists") || text.includes("duplicate")) {
      return { ok: true, skipped: true };
    }
    return { ok: false, error: text };
  }
  return { ok: true };
}

// ============================================================
// Run
// ============================================================
console.log(`\n🚀 JobPilot DB Setup`);
console.log(`   Target: ${BASE_URL}\n`);

let passed = 0;
let skipped = 0;
let failed = 0;

for (const stmt of statements) {
  const preview = stmt.replace(/\s+/g, " ").slice(0, 60) + "…";
  const result = await runSql(stmt);
  if (result.ok && result.skipped) {
    console.log(`  ⚠️  SKIP  ${preview}`);
    skipped++;
  } else if (result.ok) {
    console.log(`  ✅ OK    ${preview}`);
    passed++;
  } else {
    console.log(`  ❌ FAIL  ${preview}`);
    console.log(`           ${result.error}`);
    failed++;
  }
}

// Storage bucket
const bucketResult = await createStorageBucket();
if (bucketResult.ok && bucketResult.skipped) {
  console.log(`  ⚠️  SKIP  CREATE BUCKET resumes (already exists)`);
  skipped++;
} else if (bucketResult.ok) {
  console.log(`  ✅ OK    CREATE BUCKET resumes`);
  passed++;
} else {
  console.log(`  ❌ FAIL  CREATE BUCKET resumes`);
  console.log(`           ${bucketResult.error}`);
  failed++;
}

console.log(`\n📊 Results: ${passed} ok  ${skipped} skipped  ${failed} failed`);

if (failed > 0) {
  console.log(`\n⚠️  Some statements failed. Check errors above.`);
  console.log(
    `   If "No valid management SQL endpoint found" — the InsForge management API URL pattern`,
  );
  console.log(`   is different from what was tried. Check InsForge docs for the SQL endpoint.`);
  process.exit(1);
} else {
  console.log(`\n✅ Schema setup complete!`);
}

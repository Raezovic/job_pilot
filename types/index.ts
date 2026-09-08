// Global TypeScript types — shared across the entire project.
// Every column in the DB schema is represented here.
// Import from "@/types" — never redefine these inline.

// ============================================================
// Enum-like union types (map directly to CHECK constraints)
// ============================================================

export type ExperienceLevel = "junior" | "mid" | "senior" | "lead";
export type RemotePreference = "remote" | "onsite" | "hybrid" | "any";
export type CoverLetterTone = "formal" | "casual" | "enthusiastic";
export type WorkAuthorization =
  | "citizen"
  | "permanent_resident"
  | "visa_required";
export type JobSource = "search" | "url";
export type JobType = "fulltime" | "parttime" | "contract";
export type AgentRunStatus = "running" | "completed" | "failed";
export type AgentLogLevel = "info" | "success" | "warning" | "error";

export type MissingField =
  | "FULL NAME"
  | "PHONE"
  | "LOCATION"
  | "JOB TITLE"
  | "EXPERIENCE LEVEL"
  | "YEARS OF EXP"
  | "SKILLS"
  | "EDUCATION"
  | "WORK EXPERIENCE"
  | "JOB PREFERENCES";

// ============================================================
// JSONB shapes
// ============================================================

export type WorkExperienceEntry = {
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  responsibilities: string;
};

export type Education = {
  degree: string;
  field: string;
  institution: string;
  graduationYear: string;
};

export type CompanyResearch = {
  companyOverview: string;
  techStack: string[];
  culture: string[];
  whyThisRole: string;
  yourEdge: string[];
  gapsToAddress: string[];
  smartQuestions: string[];
  interviewPrep: string[];
  sources: string[];
};

// ============================================================
// TABLE: profiles
// ============================================================

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  current_title: string | null;
  experience_level: ExperienceLevel | null;
  years_experience: number | null;
  skills: string[];
  industries: string[];
  work_experience: WorkExperienceEntry[];
  education: Education | null;
  job_titles_seeking: string[];
  remote_preference: RemotePreference | null;
  preferred_locations: string[];
  salary_expectation: string | null;
  cover_letter_tone: CoverLetterTone | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  work_authorization: WorkAuthorization | null;
  resume_pdf_url: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
};

// ============================================================
// TABLE: agent_runs
// ============================================================

export type AgentRun = {
  id: string;
  user_id: string;
  status: AgentRunStatus;
  job_title_searched: string | null;
  location_searched: string | null;
  jobs_found: number;
  started_at: string;
  completed_at: string | null;
};

// ============================================================
// TABLE: jobs
// ============================================================

export type Job = {
  id: string;
  run_id: string | null;
  user_id: string;
  source: JobSource;
  source_url: string | null;
  external_apply_url: string | null;
  title: string | null;
  company: string | null;
  location: string | null;
  salary: string | null;
  job_type: JobType | null;
  about_role: string | null;
  responsibilities: string[];
  requirements: string[];
  nice_to_have: string[];
  benefits: string[];
  about_company: string | null;
  match_score: number | null;
  match_reason: string | null;
  matched_skills: string[];
  missing_skills: string[];
  company_research: CompanyResearch | null;
  found_at: string;
};

// ============================================================
// TABLE: agent_logs
// ============================================================

export type AgentLog = {
  id: string;
  run_id: string | null;
  user_id: string;
  message: string;
  level: AgentLogLevel;
  job_id: string | null;
  created_at: string;
};

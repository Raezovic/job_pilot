import { Profile, MissingField } from "@/types";

export type CompletenessResult = {
  percentage: number;
  isComplete: boolean;
  missingFields: MissingField[];
};

export function calculateCompletion(
  profile: Partial<Profile> | null | undefined
): CompletenessResult {
  if (!profile) {
    return {
      percentage: 0,
      isComplete: false,
      missingFields: [
        "FULL NAME",
        "PHONE",
        "LOCATION",
        "JOB TITLE",
        "EXPERIENCE LEVEL",
        "YEARS OF EXP",
        "SKILLS",
        "EDUCATION",
        "WORK EXPERIENCE",
        "JOB PREFERENCES",
      ],
    };
  }

  const checks: { label: MissingField; valid: boolean }[] = [
    {
      label: "FULL NAME",
      valid: Boolean(profile.full_name && profile.full_name.trim().length > 0),
    },
    {
      label: "PHONE",
      valid: Boolean(profile.phone && profile.phone.trim().length > 0),
    },
    {
      label: "LOCATION",
      valid: Boolean(profile.location && profile.location.trim().length > 0),
    },
    {
      label: "JOB TITLE",
      valid: Boolean(profile.current_title && profile.current_title.trim().length > 0),
    },
    {
      label: "EXPERIENCE LEVEL",
      valid: Boolean(profile.experience_level),
    },
    {
      label: "YEARS OF EXP",
      valid:
        profile.years_experience !== null &&
        profile.years_experience !== undefined &&
        profile.years_experience !== ("" as any) &&
        !Number.isNaN(Number(profile.years_experience)) &&
        Number(profile.years_experience) >= 0,
    },
    {
      label: "SKILLS",
      valid: Array.isArray(profile.skills) && profile.skills.length > 0,
    },
    {
      label: "EDUCATION",
      valid: Boolean(
        profile.education &&
          profile.education.degree?.trim() &&
          profile.education.institution?.trim()
      ),
    },
    {
      label: "WORK EXPERIENCE",
      valid:
        Array.isArray(profile.work_experience) &&
        profile.work_experience.length > 0 &&
        profile.work_experience.some(
          (w) => Boolean(w.company?.trim()) && Boolean(w.title?.trim())
        ),
    },
    {
      label: "JOB PREFERENCES",
      valid:
        Array.isArray(profile.job_titles_seeking) &&
        profile.job_titles_seeking.length > 0,
    },
  ];

  const missingFields = checks
    .filter((c) => !c.valid)
    .map((c) => c.label);

  const completedCount = checks.filter((c) => c.valid).length;
  const percentage = Math.round((completedCount / checks.length) * 100);
  const isComplete = missingFields.length === 0;

  return {
    percentage,
    isComplete,
    missingFields,
  };
}

export const calculateProfileCompleteness = calculateCompletion;

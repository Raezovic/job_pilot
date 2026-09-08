"use client";

import { useState, useTransition } from "react";
import { ChevronDown, Plus, X, Calendar, Loader2, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { saveProfileAction } from "@/actions/profile";
import {
  Profile,
  ExperienceLevel,
  RemotePreference,
  WorkAuthorization,
  CoverLetterTone,
  WorkExperienceEntry,
  Education,
} from "@/types";

interface ProfileFormProps {
  initialProfile?: Profile | null;
  userEmail?: string;
}

export function ProfileForm({ initialProfile, userEmail = "" }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Personal Info State
  const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
  const [email] = useState(userEmail || initialProfile?.email || "");
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [location, setLocation] = useState(initialProfile?.location ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialProfile?.linkedin_url ?? "");
  const [portfolioUrl, setPortfolioUrl] = useState(initialProfile?.portfolio_url ?? "");
  const [workAuth, setWorkAuth] = useState<WorkAuthorization>(
    initialProfile?.work_authorization ?? "citizen"
  );

  // 2. Professional Info State
  const [currentTitle, setCurrentTitle] = useState(initialProfile?.current_title ?? "");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialProfile?.experience_level ?? "mid"
  );
  const [yearsExperience, setYearsExperience] = useState(
    initialProfile?.years_experience !== null && initialProfile?.years_experience !== undefined
      ? String(initialProfile.years_experience)
      : ""
  );

  // Skills tag input
  const [skills, setSkills] = useState<string[]>(initialProfile?.skills ?? []);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Industries tag input
  const [industries, setIndustries] = useState<string[]>(initialProfile?.industries ?? []);
  const [newIndustryInput, setNewIndustryInput] = useState("");

  // 3. Work Experience State
  const initialWorkExperience: (WorkExperienceEntry & { id: string })[] =
    initialProfile?.work_experience && initialProfile.work_experience.length > 0
      ? initialProfile.work_experience.map((w, idx) => ({
          ...w,
          id: String(idx + 1),
        }))
      : [
          {
            id: "1",
            company: "",
            title: "",
            startDate: "",
            endDate: "",
            current: false,
            responsibilities: "",
          },
        ];

  const [workExperiences, setWorkExperiences] = useState(initialWorkExperience);

  // 4. Education State
  const [highestDegree, setHighestDegree] = useState(
    initialProfile?.education?.degree ?? "Bachelor's"
  );
  const [fieldOfStudy, setFieldOfStudy] = useState(initialProfile?.education?.field ?? "");
  const [institutionName, setInstitutionName] = useState(
    initialProfile?.education?.institution ?? ""
  );
  const [graduationYear, setGraduationYear] = useState(
    initialProfile?.education?.graduationYear ?? ""
  );

  // 5. Job Preferences State
  const [jobTitlesSeeking, setJobTitlesSeeking] = useState(
    initialProfile?.job_titles_seeking?.join(", ") ?? ""
  );
  const [remotePreference, setRemotePreference] = useState<RemotePreference>(
    initialProfile?.remote_preference ?? "any"
  );
  const [salaryExpectation, setSalaryExpectation] = useState(
    initialProfile?.salary_expectation ?? ""
  );
  const [preferredLocations, setPreferredLocations] = useState(
    initialProfile?.preferred_locations?.join(", ") ?? ""
  );
  const [coverLetterTone, setCoverLetterTone] = useState<CoverLetterTone>(
    initialProfile?.cover_letter_tone ?? "enthusiastic"
  );

  // Skill Handlers
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Industry Handlers
  const handleAddIndustry = () => {
    const trimmed = newIndustryInput.trim();
    if (trimmed && !industries.includes(trimmed)) {
      setIndustries([...industries, trimmed]);
      setNewIndustryInput("");
    }
  };

  const handleRemoveIndustry = (industryToRemove: string) => {
    setIndustries(industries.filter((i) => i !== industryToRemove));
  };

  // Work Experience Handlers
  const handleAddRole = () => {
    if (workExperiences.length >= 5) return;
    setWorkExperiences([
      ...workExperiences,
      {
        id: Date.now().toString(),
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        current: false,
        responsibilities: "",
      },
    ]);
  };

  const handleRemoveRole = (id: string) => {
    if (workExperiences.length === 1) {
      setWorkExperiences([
        {
          id: Date.now().toString(),
          company: "",
          title: "",
          startDate: "",
          endDate: "",
          current: false,
          responsibilities: "",
        },
      ]);
      return;
    }
    setWorkExperiences(workExperiences.filter((w) => w.id !== id));
  };

  const handleWorkExpChange = (
    id: string,
    field: keyof WorkExperienceEntry,
    value: string | boolean | null
  ) => {
    setWorkExperiences(
      workExperiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  // Save Handler
  const handleSave = () => {
    setSuccessMessage(null);
    setErrorMessage(null);

    const parsedEducation: Education = {
      degree: highestDegree.trim(),
      field: fieldOfStudy.trim(),
      institution: institutionName.trim(),
      graduationYear: graduationYear.trim(),
    };

    const sanitizedWorkExperience: WorkExperienceEntry[] = workExperiences
      .filter((w) => w.company.trim() || w.title.trim())
      .map(({ id: _, ...rest }) => ({
        ...rest,
        company: rest.company.trim(),
        title: rest.title.trim(),
        startDate: rest.startDate.trim(),
        endDate: rest.current ? null : rest.endDate ? rest.endDate.trim() : null,
        responsibilities: rest.responsibilities.trim(),
      }));

    const parsedJobTitles = jobTitlesSeeking
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const parsedPreferredLocations = preferredLocations
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parseYearsExp = (val: string): number | null => {
      if (!val || !val.trim()) return null;
      const num = parseInt(val.replace(/[^0-9]/g, ""), 10);
      return Number.isNaN(num) ? null : num;
    };

    const payload = {
      full_name: fullName.trim() || null,
      phone: phone.trim() || null,
      location: location.trim() || null,
      linkedin_url: linkedinUrl.trim() || null,
      portfolio_url: portfolioUrl.trim() || null,
      work_authorization: workAuth,
      current_title: currentTitle.trim() || null,
      experience_level: experienceLevel,
      years_experience: parseYearsExp(yearsExperience),
      skills,
      industries,
      work_experience: sanitizedWorkExperience,
      education: parsedEducation,
      job_titles_seeking: parsedJobTitles,
      remote_preference: remotePreference,
      salary_expectation: salaryExpectation.trim() || null,
      preferred_locations: parsedPreferredLocations,
      cover_letter_tone: coverLetterTone,
    };

    startTransition(async () => {
      const result = await saveProfileAction(payload);
      if (result.success) {
        setSuccessMessage("Profile saved successfully!");
      } else {
        setErrorMessage(result.error || "Failed to save profile.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs space-y-8">
      {/* Form Header */}
      <div>
        <h2 className="text-xl font-bold text-text-primary">Profile Information</h2>
        <p className="text-xs sm:text-sm font-medium text-text-secondary mt-1">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      <hr className="border-border" />

      {/* 1. PERSONAL INFO */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
          Personal Info
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              FULL NAME
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none font-medium cursor-not-allowed opacity-90"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              PHONE NUMBER
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              LOCATION
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* LinkedIn URL */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              LINKEDIN URL
            </label>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Portfolio / GitHub */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              PORTFOLIO / GITHUB
            </label>
            <input
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://github.com/username"
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Work Authorization */}
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              WORK AUTHORIZATION
            </label>
            <div className="relative">
              <select
                value={workAuth}
                onChange={(e) => setWorkAuth(e.target.value as WorkAuthorization)}
                className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
              >
                <option value="citizen">Citizen</option>
                <option value="permanent_resident">Permanent Resident</option>
                <option value="visa_required">Require Sponsorship / Visa</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* 2. PROFESSIONAL INFO */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
          Professional Info
        </h3>
        <div className="space-y-4">
          {/* Current/Recent Job Title */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              CURRENT/RECENT JOB TITLE
            </label>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors"
            />
          </div>

          {/* Experience Level & Years */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                EXPERIENCE LEVEL
              </label>
              <div className="relative">
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                  className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                </select>
                <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                YEARS OF EXPERIENCE
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="4"
                className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors"
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              SKILLS
            </label>
            <div className="flex items-center gap-2 mb-2.5">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add a skill (e.g. React, Next.js)"
                className="flex-1 bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="bg-surface-secondary hover:bg-border-light border border-border px-4 py-2 text-xs font-semibold text-text-primary rounded-lg transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-surface-secondary border border-border text-text-primary text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Industries Worked In */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              INDUSTRIES WORKED IN (OPTIONAL)
            </label>
            <div className="flex items-center gap-2 mb-2.5">
              <input
                type="text"
                value={newIndustryInput}
                onChange={(e) => setNewIndustryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIndustry();
                  }
                }}
                placeholder="E.g. FinTech, Healthcare, E-Commerce"
                className="flex-1 bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={handleAddIndustry}
                className="bg-surface-secondary hover:bg-border-light border border-border px-4 py-2 text-xs font-semibold text-text-primary rounded-lg transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            {industries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {industries.map((ind) => (
                  <span
                    key={ind}
                    className="bg-surface-secondary border border-border text-text-primary text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-2xs"
                  >
                    {ind}
                    <button
                      type="button"
                      onClick={() => handleRemoveIndustry(ind)}
                      className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* 3. WORK EXPERIENCE */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Work Experience
          </h3>
          <button
            type="button"
            onClick={handleAddRole}
            className="text-xs font-bold text-accent hover:text-accent-dark transition-colors cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Add role
          </button>
        </div>

        <div className="space-y-4">
          {workExperiences.map((exp, index) => (
            <div
              key={exp.id}
              className="bg-surface-secondary/40 border border-border rounded-xl p-5 space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary">Role {index + 1}</span>
                {workExperiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(exp.id)}
                    className="text-text-muted hover:text-error transition-colors text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    COMPANY NAME
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => handleWorkExpChange(exp.id, "company", e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                  />
                </div>

                {/* Job Title */}
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    JOB TITLE
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => handleWorkExpChange(exp.id, "title", e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                    START DATE
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleWorkExpChange(exp.id, "startDate", e.target.value)}
                      placeholder="e.g. Jan 2022"
                      className="w-full bg-surface border border-border rounded-lg px-3.5 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium pr-10"
                    />
                    <Calendar className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* End Date + Currently Working Here */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                      END DATE
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-text-primary font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => handleWorkExpChange(exp.id, "current", e.target.checked)}
                        className="rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
                      />
                      Currently working here
                    </label>
                  </div>
                  <input
                    type="text"
                    value={exp.current ? "Present" : exp.endDate || ""}
                    disabled={exp.current}
                    onChange={(e) => handleWorkExpChange(exp.id, "endDate", e.target.value)}
                    placeholder="e.g. Present or Dec 2024"
                    className={`w-full border border-border rounded-lg px-3.5 py-2 text-sm font-medium ${
                      exp.current
                        ? "bg-surface-secondary text-text-muted cursor-not-allowed"
                        : "bg-surface text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    }`}
                  />
                </div>
              </div>

              {/* Key Responsibilities */}
              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  KEY RESPONSIBILITIES
                </label>
                <textarea
                  rows={3}
                  value={exp.responsibilities}
                  onChange={(e) => handleWorkExpChange(exp.id, "responsibilities", e.target.value)}
                  placeholder="Built core product features, improved web vitals, led technical architecture..."
                  className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-border" />

      {/* 4. EDUCATION */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
          Education
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Highest Degree */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              HIGHEST DEGREE
            </label>
            <div className="relative">
              <select
                value={highestDegree}
                onChange={(e) => setHighestDegree(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
              >
                <option value="High School">High School</option>
                <option value="Associate">Associate Degree</option>
                <option value="Bachelor's">Bachelor's Degree</option>
                <option value="Master's">Master's Degree</option>
                <option value="Doctorate">Doctorate (Ph.D.)</option>
                <option value="Other">Other / Self-Taught</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Field of Study */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              FIELD OF STUDY
            </label>
            <input
              type="text"
              value={fieldOfStudy}
              onChange={(e) => setFieldOfStudy(e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors"
            />
          </div>

          {/* Institution Name */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              INSTITUTION NAME
            </label>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="e.g. Stanford University"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              GRADUATION YEAR
            </label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="YYYY (e.g. 2023)"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>
        </div>
      </section>

      <hr className="border-border" />

      {/* 5. JOB PREFERENCES */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-text-primary uppercase tracking-wide">
          Job Preferences
        </h3>
        <div className="space-y-4">
          {/* Job Titles Seeking */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              JOB TITLES SEEKING (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={jobTitlesSeeking}
              onChange={(e) => setJobTitlesSeeking(e.target.value)}
              placeholder="Frontend Engineer, React Developer, Full Stack Engineer"
              className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Remote Preference */}
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                REMOTE PREFERENCE
              </label>
              <div className="relative">
                <select
                  value={remotePreference}
                  onChange={(e) => setRemotePreference(e.target.value as RemotePreference)}
                  className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
                >
                  <option value="any">Any</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
                <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Salary Expectation */}
            <div>
              <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                SALARY EXPECTATION (OPTIONAL)
              </label>
              <input
                type="text"
                value={salaryExpectation}
                onChange={(e) => setSalaryExpectation(e.target.value)}
                placeholder="e.g. $120k+ / $150,000"
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              PREFERRED LOCATIONS (COMMA SEPARATED, OPTIONAL)
            </label>
            <input
              type="text"
              value={preferredLocations}
              onChange={(e) => setPreferredLocations(e.target.value)}
              placeholder="e.g. New York, London, Remote US"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>

          {/* Cover Letter Tone */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              COVER LETTER TONE
            </label>
            <div className="relative">
              <select
                value={coverLetterTone}
                onChange={(e) => setCoverLetterTone(e.target.value as CoverLetterTone)}
                className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
              >
                <option value="enthusiastic">Enthusiastic</option>
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-xs font-semibold text-error bg-error/10 border border-error/20 p-3.5 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 text-xs font-semibold text-success-darker bg-success-lightest border border-success-light p-3.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Save Profile Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="w-full bg-accent hover:bg-accent-dark text-accent-foreground text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <span>Save Profile</span>
          )}
        </button>
      </div>
    </div>
  );
}

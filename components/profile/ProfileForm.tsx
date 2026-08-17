"use client";

import { useState } from "react";
import { ChevronDown, Plus, X, Calendar } from "lucide-react";

export function ProfileForm() {
  // Personal Info State
  const [fullName, setFullName] = useState("Faizan Ali");
  const [email] = useState("faizan@jsmastery.pro");
  const [phone, setPhone] = useState("+1 (555) 000-0000");
  const [location, setLocation] = useState("City, Country");
  const [linkedinUrl, setLinkedinUrl] = useState("https://linkedin.com/in/faizan");
  const [portfolioUrl, setPortfolioUrl] = useState("https://github.com/jsmastery");
  const [workAuth, setWorkAuth] = useState("Citizen");

  // Professional Info State
  const [currentTitle, setCurrentTitle] = useState("Frontend Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Junior");
  const [yearsExperience, setYearsExperience] = useState("4");

  // Skills tag input
  const [skills, setSkills] = useState(["React", "TypeScript", "Next.js", "Tailwind CSS"]);
  const [newSkillInput, setNewSkillInput] = useState("");

  // Industries tag input
  const [industries, setIndustries] = useState<string[]>([]);
  const [newIndustryInput, setNewIndustryInput] = useState("");

  // Work Experience State
  const [workExperiences, setWorkExperiences] = useState([
    {
      id: "1",
      company: "Vercel",
      title: "Frontend Engineer",
      startDate: "January 2022",
      endDate: "",
      current: true,
      responsibilities: "Built Next.js features and optimized web vitals. Led a team of 3 developers.",
    },
  ]);

  // Education State
  const [highestDegree, setHighestDegree] = useState("High School");
  const [fieldOfStudy, setFieldOfStudy] = useState("Computer Science");
  const [institutionName, setInstitutionName] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  // Job Preferences State
  const [jobTitlesSeeking, setJobTitlesSeeking] = useState("Frontend Engineer, React Developer");
  const [remotePreference, setRemotePreference] = useState("Any");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [preferredLocations, setPreferredLocations] = useState("");

  // Skill Handlers
  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Industry Handlers
  const handleAddIndustry = () => {
    if (newIndustryInput.trim() && !industries.includes(newIndustryInput.trim())) {
      setIndustries([...industries, newIndustryInput.trim()]);
      setNewIndustryInput("");
    }
  };

  const handleRemoveIndustry = (industryToRemove: string) => {
    setIndustries(industries.filter((i) => i !== industryToRemove));
  };

  // Work Experience Handlers
  const handleAddRole = () => {
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

  const handleWorkExpChange = (id: string, field: string, value: any) => {
    setWorkExperiences(
      workExperiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
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
                onChange={(e) => setWorkAuth(e.target.value)}
                className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
              >
                <option value="Citizen">Citizen</option>
                <option value="Permanent Resident">Permanent Resident</option>
                <option value="Visa Required">Require Sponsorship / Visa</option>
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
              placeholder="Frontend Engineer"
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
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
                >
                  <option value="Junior">Junior</option>
                  <option value="Mid">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
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
                placeholder="Add a skill"
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
                placeholder="E.g. FinTech, Healthcare"
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
          {workExperiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-surface-secondary/40 border border-border rounded-xl p-5 space-y-4"
            >
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
                    placeholder="Vercel"
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
                    placeholder="Frontend Engineer"
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
                      placeholder="January 2022"
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
                    value={exp.current ? "-------- ----" : exp.endDate}
                    disabled={exp.current}
                    onChange={(e) => handleWorkExpChange(exp.id, "endDate", e.target.value)}
                    placeholder="Present"
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
                  placeholder="Built Next.js features and optimized web vitals..."
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
                <option value="Other">Other</option>
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
              placeholder="Computer Science"
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
              placeholder="E.g. State University"
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
              placeholder="YYYY"
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
              JOB TITLES SEEKING
            </label>
            <input
              type="text"
              value={jobTitlesSeeking}
              onChange={(e) => setJobTitlesSeeking(e.target.value)}
              placeholder="Frontend Engineer, React Developer"
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
                  onChange={(e) => setRemotePreference(e.target.value)}
                  className="w-full bg-surface-secondary border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium appearance-none cursor-pointer pr-10"
                >
                  <option value="Any">Any</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
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
                placeholder="E.g. $120k+"
                className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
              />
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">
              PREFERRED LOCATIONS (OPTIONAL)
            </label>
            <input
              type="text"
              value={preferredLocations}
              onChange={(e) => setPreferredLocations(e.target.value)}
              placeholder="E.g. New York, London"
              className="w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent font-medium transition-colors placeholder:text-text-muted"
            />
          </div>
        </div>
      </section>

      {/* Save Profile Button */}
      <div className="pt-2">
        <button
          type="button"
          className="w-full bg-accent hover:bg-accent-dark text-accent-foreground text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
}

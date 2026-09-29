"use server";

import path from "path";
import { pathToFileURL } from "url";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { createInsforgeServer, createInsforgeAdmin } from "@/lib/insforge-server";
import { calculateCompletion } from "@/lib/profile-utils";
import { createPostHogServer } from "@/lib/posthog-server";
import {
  Profile,
  ExperienceLevel,
  RemotePreference,
  WorkAuthorization,
  CoverLetterTone,
  WorkExperienceEntry,
  Education,
} from "@/types";

export type ProfileFormInput = {
  full_name?: string | null;
  phone?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  portfolio_url?: string | null;
  work_authorization?: WorkAuthorization | null;
  current_title?: string | null;
  experience_level?: ExperienceLevel | null;
  years_experience?: number | null;
  skills?: string[];
  industries?: string[];
  work_experience?: WorkExperienceEntry[];
  education?: Education | null;
  job_titles_seeking?: string[];
  remote_preference?: RemotePreference | null;
  salary_expectation?: string | null;
  preferred_locations?: string[];
  cover_letter_tone?: CoverLetterTone | null;
};

export async function saveProfileAction(payload: ProfileFormInput) {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
    const user = authData?.user;

    if (!user || authError) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    // Fetch existing profile to check previous completion state
    const { data: existingProfile } = await insforge.database
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const completeness = calculateCompletion({
      ...existingProfile,
      ...payload,
    });

    const parseYearsExperience = (val: unknown): number | null => {
      if (val === null || val === undefined || val === "") return null;
      if (typeof val === "number" && !Number.isNaN(val)) return val;
      const parsed = parseInt(String(val).replace(/[^0-9]/g, ""), 10);
      return Number.isNaN(parsed) ? null : parsed;
    };

    const updatePayload = {
      id: user.id,
      email: user.email ?? existingProfile?.email ?? null,
      full_name: payload.full_name ?? null,
      phone: payload.phone ?? null,
      location: payload.location ?? null,
      linkedin_url: payload.linkedin_url ?? null,
      portfolio_url: payload.portfolio_url ?? null,
      work_authorization: payload.work_authorization ?? null,
      current_title: payload.current_title ?? null,
      experience_level: payload.experience_level ?? null,
      years_experience: parseYearsExperience(payload.years_experience),
      skills: payload.skills ?? [],
      industries: payload.industries ?? [],
      work_experience: payload.work_experience ?? [],
      education: payload.education ?? null,
      job_titles_seeking: payload.job_titles_seeking ?? [],
      remote_preference: payload.remote_preference ?? null,
      salary_expectation: payload.salary_expectation ?? null,
      preferred_locations: payload.preferred_locations ?? [],
      cover_letter_tone: payload.cover_letter_tone ?? null,
      is_complete: completeness.isComplete,
    };

    const { error: upsertError } = await insforge.database
      .from("profiles")
      .upsert(updatePayload);

    if (upsertError) {
      console.error("[actions/profile] Upsert error:", upsertError);
      return { success: false, error: upsertError.message || "Failed to save profile." };
    }

    // Fire profile_completed event if profile newly became complete
    if (!existingProfile?.is_complete && completeness.isComplete) {
      try {
        const posthog = createPostHogServer();
        if (posthog) {
          posthog.capture({
            distinctId: user.id,
            event: "profile_completed",
            properties: { userId: user.id },
          });
          await posthog.shutdown();
        }
      } catch (phError) {
        console.error("[actions/profile] PostHog capture error:", phError);
      }
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      isComplete: completeness.isComplete,
      percentage: completeness.percentage,
      missingFields: completeness.missingFields,
    };
  } catch (error) {
    console.error("[actions/profile]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save profile",
    };
  }
}

export async function uploadResumeAction(formData: FormData) {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
    const user = authData?.user;

    if (!user || authError) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const file = formData.get("resume") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "Please select a valid PDF file to upload." };
    }

    // Validate 5MB limit
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: "File size exceeds 5MB limit." };
    }

    // Validate PDF mime type or extension
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return { success: false, error: "Only PDF files are supported." };
    }

    const storagePath = `${user.id}/resume.pdf`;

    // Convert file to in-memory Blob to guarantee stream integrity in Node server actions
    const fileBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: "application/pdf" });

    const admin = createInsforgeAdmin();
    const { error: uploadError } = await admin.storage
      .from("resumes")
      .upload(storagePath, fileBlob);

    if (uploadError) {
      console.error("[actions/profile] Storage upload error:", uploadError);
      return { success: false, error: uploadError.message || "Failed to upload resume." };
    }

    const resumeUrl = "/api/resume/view";

    const { error: updateError } = await insforge.database
      .from("profiles")
      .upsert({ id: user.id, email: user.email ?? null, resume_pdf_url: resumeUrl });

    if (updateError) {
      console.error("[actions/profile] Resume URL update error:", updateError);
      return {
        success: false,
        error: "Uploaded resume but failed to link to profile.",
      };
    }

    revalidatePath("/profile");
    return { success: true, resumeUrl };
  } catch (error) {
    console.error("[actions/profile/uploadResume]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload resume",
    };
  }
}

export async function extractProfileFromResumeAction() {
  try {
    const insforge = await createInsforgeServer();
    const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
    const user = authData?.user;

    if (!user || authError) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const storagePath = `${user.id}/resume.pdf`;

    const admin = createInsforgeAdmin();
    const { data: fileData, error: downloadError } = await admin.storage
      .from("resumes")
      .download(storagePath);

    if (downloadError || !fileData) {
      return {
        success: false,
        error: "No uploaded resume found. Please upload a PDF resume first.",
      };
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf-parse v2 (PDFParse class)
    const { PDFParse } = await import("pdf-parse");
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const workerPath = path.resolve(
      process.cwd(),
      "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"
    );
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

    const parser = new PDFParse({ data: buffer });
    const textResult = await parser.getText();
    await parser.destroy();

    const rawText = textResult.text?.trim() || "";

    if (!rawText || rawText.length < 50) {
      return {
        success: false,
        error: "Could not extract text from this PDF. Please try a different file.",
      };
    }

    const groqApiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY;
    const openaiApiKey = process.env.OPENAI_API_KEY;

    let aiClient: OpenAI;
    let modelName = "openai/gpt-oss-120b";

    if (groqApiKey) {
      aiClient = new OpenAI({
        apiKey: groqApiKey,
        baseURL: "https://api.groq.com/openai/v1",
      });
      modelName = "openai/gpt-oss-120b";
    } else if (openaiApiKey) {
      aiClient = new OpenAI({ apiKey: openaiApiKey });
      modelName = "gpt-4o";
    } else {
      return {
        success: false,
        error: "AI API Key (Groq or OpenAI) is missing in server environment.",
      };
    }

    const systemPrompt = `You are a professional resume parser. Extract structured profile data from the raw resume text into valid JSON matching this schema:
{
  "full_name": string | null,
  "phone": string | null,
  "location": string | null,
  "linkedin_url": string | null,
  "portfolio_url": string | null,
  "work_authorization": "citizen" | "permanent_resident" | "visa_required" | null,
  "current_title": string | null,
  "experience_level": "junior" | "mid" | "senior" | "lead" | null,
  "years_experience": number | null,
  "skills": string[],
  "industries": string[],
  "work_experience": Array<{
    "company": string,
    "title": string,
    "startDate": string,
    "endDate": string | null,
    "current": boolean,
    "responsibilities": string
  }>,
  "education": {
    "degree": string,
    "field": string,
    "institution": string,
    "graduationYear": string
  } | null,
  "job_titles_seeking": string[],
  "remote_preference": "remote" | "onsite" | "hybrid" | "any" | null,
  "salary_expectation": string | null,
  "preferred_locations": string[],
  "cover_letter_tone": "formal" | "casual" | "enthusiastic" | null
}
Include at most 3 work_experience items (most recent/relevant). Return strictly valid JSON.`;

    const completion = await aiClient.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `RAW RESUME TEXT:\n${rawText}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return { success: false, error: "AI failed to parse resume content." };
    }

    const extractedData = JSON.parse(content) as Partial<ProfileFormInput>;
    return { success: true, data: extractedData };
  } catch (error) {
    console.error("[actions/profile/extractProfile]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to extract profile from resume",
    };
  }
}

export const saveProfile = saveProfileAction;
export const uploadResume = uploadResumeAction;
export const extractProfile = extractProfileFromResumeAction;

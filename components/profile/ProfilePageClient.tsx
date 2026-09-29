"use client";

import { useRef } from "react";
import { ResumeUploadSection } from "@/components/profile/ResumeUploadSection";
import { ProfileForm, ProfileFormHandle } from "@/components/profile/ProfileForm";
import { Profile } from "@/types";
import { ProfileFormInput } from "@/actions/profile";

interface ProfilePageClientProps {
  initialProfile?: Profile | null;
  userEmail?: string;
}

export function ProfilePageClient({ initialProfile, userEmail = "" }: ProfilePageClientProps) {
  const formRef = useRef<ProfileFormHandle>(null);

  const handleExtracted = (extracted: Partial<ProfileFormInput>) => {
    formRef.current?.applyExtracted(extracted);
  };

  return (
    <div className="space-y-6">
      <ResumeUploadSection
        resumePdfUrl={initialProfile?.resume_pdf_url ?? null}
        onExtracted={handleExtracted}
      />
      <ProfileForm
        ref={formRef}
        key={initialProfile?.updated_at || initialProfile?.id || userEmail}
        initialProfile={initialProfile}
        userEmail={userEmail}
      />
    </div>
  );
}

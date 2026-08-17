import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileAttentionBanner } from "@/components/profile/ProfileAttentionBanner";
import { ConnectedAccounts } from "@/components/profile/ConnectedAccounts";
import { ResumeUploadSection } from "@/components/profile/ResumeUploadSection";
import { ProfileForm } from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const {
    data: { user },
  } = await insforge.auth.getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-[840px] space-y-6">
          <ProfileAttentionBanner />
          <ConnectedAccounts />
          <ResumeUploadSection />
          <ProfileForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}


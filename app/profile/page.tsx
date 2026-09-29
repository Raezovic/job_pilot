import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProfileAttentionBanner } from "@/components/profile/ProfileAttentionBanner";
import { ConnectedAccounts } from "@/components/profile/ConnectedAccounts";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { calculateCompletion } from "@/lib/profile-utils";
import { Profile } from "@/types";

export default async function ProfilePage() {
  const insforge = await createInsforgeServer();
  const { data: authData, error: authError } = await insforge.auth.getCurrentUser();
  const user = authData?.user;

  if (!user || authError) {
    redirect("/login");
  }

  const { data: profile } = await insforge.database
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const typedProfile = (profile as Profile) || null;
  const completeness = calculateCompletion(typedProfile);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-[840px] space-y-6">
          <ProfileAttentionBanner
            completionPercentage={completeness.percentage}
            missingFields={completeness.missingFields}
          />
          <ConnectedAccounts />
          <ProfilePageClient
            initialProfile={typedProfile}
            userEmail={user.email ?? ""}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { createInsforgeServer } from "@/lib/insforge-server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function FindJobsPage() {
  const insforge = await createInsforgeServer();
  const { data: { user } } = await insforge.auth.getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-grow p-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-text-primary">Find Jobs</h1>
            <p className="text-sm font-medium text-text-secondary mt-2">
              Welcome to the job discovery center, {user.email || "User"}! This is a placeholder for searching and filtering matched opportunities.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

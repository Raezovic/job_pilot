import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-surface p-8 shadow-xs space-y-4">
          <h1 className="text-2xl font-bold text-text-primary">Privacy Policy</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Your privacy is important to us. JobPilot collects only the information necessary to assist you with AI-driven job discovery, resume tailoring, and career insights.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-12 px-6">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-surface p-8 shadow-xs space-y-4">
          <h1 className="text-2xl font-bold text-text-primary">Terms & Conditions</h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            By using JobPilot, you agree to our terms of service regarding automated job searches and application assistance.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

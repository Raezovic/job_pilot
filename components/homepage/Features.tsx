import Image from "next/image";

export function Features() {
  return (
    <div className="w-full bg-surface-secondary py-20 px-6 sm:px-8 flex flex-col gap-24">
      {/* Feature Block 1: Manage Your Job Search With Ease */}
      <section className="mx-auto max-w-[1440px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
            Manage Your Job Search With Ease
          </h2>

          <div className="flex flex-col gap-6">
            {/* Feature 1 (Highlighted) */}
            <div className="border-l-2 border-accent pl-6 py-1">
              <h3 className="text-base font-semibold text-text-primary">
                Find jobs that actually fit
              </h3>
              <p className="mt-2 text-sm font-medium text-text-secondary leading-relaxed">
                Search by title and location or paste a job link. Get matched roles
                you can quickly scan.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-l border-border-muted pl-6 py-1">
              <h3 className="text-base font-semibold text-text-primary">
                Know the Company Before You Apply
              </h3>
              <p className="mt-2 text-sm font-medium text-text-secondary leading-relaxed">
                Stop guessing what a company is about. JobPilot browses their
                site and gives you everything you need to apply with confidence.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-l border-border-muted pl-6 py-1">
              <h3 className="text-base font-semibold text-text-primary">
                Keep track of every application
              </h3>
              <p className="mt-2 text-sm font-medium text-text-secondary leading-relaxed">
                Keep a clear view of every job you've found, tailored. Your
                activity and progress all stay in one simple place.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Mockup */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[620px] aspect-[4/3] rounded-2xl border border-border bg-surface shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <Image
              src="/images/jobs-lists.png"
              alt="Job Listings Matching Preview"
              fill
              className="object-cover object-top p-1"
              sizes="(max-w-768px) 100vw, 620px"
            />
          </div>
        </div>
      </section>

      {/* Feature Block 2: Apply With More Confidence, Every Time */}
      <section className="mx-auto max-w-[1440px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Visual Mockup (Agent Logs) */}
        <div className="lg:col-span-7 flex justify-center order-2 lg:order-1">
          <div className="relative w-full max-w-[580px] aspect-[4/3] rounded-xl border border-border bg-surface shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
            <Image
              src="/images/agnet-log.png"
              alt="AI Agent Console Logs"
              fill
              className="object-cover"
              sizes="(max-w-768px) 100vw, 580px"
            />
          </div>
        </div>

        {/* Right Column: Text Content */}
        <div className="lg:col-span-5 flex flex-col gap-8 order-1 lg:order-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary leading-tight">
            Apply With More Confidence, Every Time
          </h2>

          <div className="flex flex-col gap-6">
            {/* Feature 1 */}
            <div className="border-l border-border-muted pl-6 py-1">
              <h3 className="text-base font-semibold text-text-primary">
                Understand your match score
              </h3>
              <p className="mt-2 text-sm font-medium text-text-secondary leading-relaxed">
                See how your profile lines up with each role before you apply.
                Get a clear breakdown of what fits and what's missing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-l border-border-muted pl-6 py-1">
              <h3 className="text-base font-semibold text-text-primary">
                AI-Powered Job Matching
              </h3>
              <p className="mt-2 text-sm font-medium text-text-secondary leading-relaxed">
                Stop guessing which jobs are worth applying to. JobPilot scores
                every role against your actual skills so you focus on the ones
                that matter.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-l border-border-muted pl-6 py-1">
              <h3 className="text-base font-semibold text-text-primary">
                Focus on the right roles
              </h3>
              <p className="mt-2 text-sm font-medium text-text-secondary leading-relaxed">
                Filter out low fit jobs and stay on the ones that actually
                matter. Spend less time sorting and more time applying.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

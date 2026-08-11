import Image from "next/image";

export function Testimonial() {
  return (
    <section className="bg-surface py-20 px-6 sm:px-8 border-t border-b border-border">
      <div className="mx-auto max-w-[1440px] flex flex-col items-center text-center">
        {/* Category Label */}
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          Success Stories
        </span>

        {/* Quote */}
        <blockquote className="mt-8 max-w-3xl text-xl sm:text-2xl font-medium leading-relaxed text-text-primary italic">
          “I used to spend my evenings copy-pasting resumes. Now I open my
          dashboard to see interviews waiting. It feels like cheating. Had 3
          offers on the table simultaneously.”
        </blockquote>

        {/* User Info */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border shadow-xs">
            <Image
              src="/images/user-icon.png"
              alt="Tom Wilson"
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="flex flex-col">
            <cite className="not-italic text-sm font-semibold text-text-primary">
              Tom Wilson
            </cite>
            <span className="text-xs font-normal text-text-muted">
              Junior Developer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

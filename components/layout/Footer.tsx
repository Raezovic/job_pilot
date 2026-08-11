import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-8 px-6 mt-auto">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-[10px] bg-linear-to-tr from-accent to-accent-dark shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-foreground"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-[19px] font-bold leading-7 text-text-darkest tracking-tight">
            JobPilot
          </span>
        </Link>

        {/* Right Side: Links */}
        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-text-secondary">
          <Link href="/dashboard" className="hover:text-accent transition-colors">
            Dashboard
          </Link>
          <Link href="/privacy-policy" className="hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-and-conditions" className="hover:text-accent transition-colors">
            Terms & Condition
          </Link>
        </div>
      </div>
    </footer>
  );
}

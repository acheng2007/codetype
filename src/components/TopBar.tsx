"use client";

import Link from "next/link";

export function TopBar({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <header
      className={`w-full top-0 z-50 pt-lg transition-opacity duration-200 ${
        dimmed ? "opacity-30" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center w-full px-gutter h-16 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-sm">
          <TerminalGlyph className="w-6 h-6 text-primary" />
          <Link
            href="/"
            className="font-ui-header text-2xl font-semibold tracking-tight text-on-surface hover:text-primary transition-colors"
          >
            code_type
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-md text-on-surface-variant">
          <NavIcon title="Arena" href="/">
            <KeyboardGlyph />
          </NavIcon>
          <NavIcon title="Leaderboard (soon)" href="#" disabled>
            <TrophyGlyph />
          </NavIcon>
          <NavIcon title="About (soon)" href="#" disabled>
            <InfoGlyph />
          </NavIcon>
          <NavIcon title="Settings (soon)" href="#" disabled>
            <GearGlyph />
          </NavIcon>
        </nav>
      </div>
    </header>
  );
}

function NavIcon({
  href,
  title,
  disabled,
  children,
}: {
  href: string;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const classes =
    "flex items-center p-2 rounded-lg transition-colors " +
    (disabled
      ? "text-on-surface-variant/40 cursor-not-allowed"
      : "hover:text-primary hover:bg-surface-container-high");
  if (disabled) {
    return (
      <span title={title} className={classes} aria-disabled>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} title={title} className={classes}>
      {children}
    </Link>
  );
}

function TerminalGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <polyline points="4 7 9 12 4 17" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function KeyboardGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
    </svg>
  );
}

function TrophyGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
      <path d="M17 4h3v3a3 3 0 0 1-3 3M7 4H4v3a3 3 0 0 0 3 3" />
    </svg>
  );
}

function InfoGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="8.01" />
      <line x1="11" y1="12" x2="12" y2="12" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="11" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function GearGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

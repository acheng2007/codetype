"use client";

export function Footer({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <footer
      className={`w-full bottom-0 z-50 mb-sm transition-opacity duration-200 ${
        dimmed ? "opacity-20" : "opacity-100"
      }`}
    >
      <div className="flex justify-between items-center px-gutter py-sm h-12 max-w-container-max mx-auto w-full">
        <div className="font-code-sm text-code-sm text-on-surface-variant opacity-60 hover:opacity-100 transition-opacity">
          v0.1.0-mvp
        </div>
        <div className="flex items-center gap-gutter font-code-sm text-code-sm opacity-60">
          <a
            href="https://github.com"
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            github
          </a>
          <a
            href="#"
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            about
          </a>
        </div>
      </div>
    </footer>
  );
}

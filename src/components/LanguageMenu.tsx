"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  LANGUAGES_UI_ORDER,
  languageDisplayName,
  languageMatchesQuery,
} from "@/lib/languages";
import type { Language } from "@/lib/types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: Language;
  onChange: (language: Language) => void;
};

export function LanguageMenu({ open, onOpenChange, value, onChange }: Props) {
  const titleId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => LANGUAGES_UI_ORDER.filter((l) => languageMatchesQuery(l, query)),
    [query],
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    document.body.style.overflow = "hidden";
    const t = requestAnimationFrame(() => searchRef.current?.focus());
    return () => {
      cancelAnimationFrame(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-gutter backdrop-blur-sm"
      role="presentation"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="flex w-full max-w-[500px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container shadow-2xl"
        role="dialog"
        aria-modal="true"
        id="language-menu-dialog"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">
          Choose programming language
        </h2>
        <div className="flex items-center gap-sm border-b border-outline-variant bg-surface-container-high px-md py-sm">
          <SearchGlyph className="h-5 w-5 shrink-0 text-on-surface-variant" />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Language..."
            autoComplete="off"
            className="w-full border-none bg-transparent p-0 font-ui-body text-ui-body text-on-surface outline-none ring-0 placeholder:text-on-surface-variant focus:ring-0"
          />
        </div>
        <div
          className="max-h-[300px] overflow-y-auto py-sm"
          role="listbox"
          aria-label="Languages"
        >
          {filtered.length === 0 ? (
            <div className="px-md py-sm font-ui-body text-on-surface-variant">
              No matches.
            </div>
          ) : (
            filtered.map((lang) => {
              const selected = lang === value;
              return (
                <button
                  key={lang}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(lang);
                    onOpenChange(false);
                  }}
                  className={`group flex w-full items-center justify-between px-md py-sm text-left font-ui-body text-ui-body transition-colors hover:bg-surface-container-highest ${
                    selected
                      ? "border-l-2 border-primary bg-primary/10"
                      : "border-l-2 border-transparent"
                  }`}
                >
                  <span
                    className={
                      selected
                        ? "font-medium text-primary"
                        : "text-on-surface-variant group-hover:text-on-surface"
                    }
                  >
                    {languageDisplayName(lang)}
                  </span>
                  {selected ? (
                    <CheckGlyph className="h-[18px] w-[18px] shrink-0 text-primary" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 12l4 4L19 7" />
    </svg>
  );
}

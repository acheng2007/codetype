"use client";

import { useEffect, useState } from "react";
import type { Language, Mode, TimeDuration } from "@/lib/types";
import { languageDisplayName } from "@/lib/languages";
import type { ComputedStats } from "@/lib/engine";

type Props = {
  language: Language;
  mode: Mode;
  duration: TimeDuration;
  startedAt: number | null;
  finishedAt: number | null;
  stats: ComputedStats;
  remainingMs?: number | null;
  active: boolean;
  /** When set, globe + language open the language picker (stops `main` click-to-focus). */
  onOpenLanguageMenu?: () => void;
  languageMenuOpen?: boolean;
};

export function LiveStats({
  language,
  mode,
  duration,
  startedAt,
  finishedAt,
  stats,
  remainingMs,
  active,
  onOpenLanguageMenu,
  languageMenuOpen = false,
}: Props) {
  // Tick the elapsed timer once per second while the test is running, so the
  // 0:12-style readout updates even when no keys are pressed.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active || startedAt == null || finishedAt != null) return;
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, [active, startedAt, finishedAt]);

  const elapsedSec =
    startedAt == null
      ? 0
      : Math.floor(((finishedAt ?? performance.now()) - startedAt) / 1000);

  const timeReadout =
    mode === "time" && remainingMs != null
      ? formatClock(Math.max(0, Math.ceil(remainingMs / 1000)))
      : formatClock(elapsedSec);

  return (
    <div
      className={`w-full flex flex-col items-center gap-xs transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="flex items-center justify-center gap-xs font-code-sm text-code-sm text-on-surface-variant opacity-60">
        {onOpenLanguageMenu ? (
          <button
            type="button"
            className="flex items-center gap-xs rounded-md border border-transparent px-1.5 py-0.5 transition-colors hover:border-outline-variant/40 hover:bg-surface-container-high hover:text-on-surface focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40"
            onClick={(e) => {
              e.stopPropagation();
              onOpenLanguageMenu();
            }}
            aria-haspopup="dialog"
            aria-expanded={languageMenuOpen}
            aria-controls="language-menu-dialog"
          >
            <GlobeGlyph />
            <span>{languageDisplayName(language)}</span>
          </button>
        ) : (
          <>
            <GlobeGlyph />
            <span>{languageDisplayName(language)}</span>
          </>
        )}
        <span className="opacity-40">·</span>
        <span>{mode === "time" ? `${duration}s` : mode}</span>
      </div>
      <div className="w-full flex justify-between items-center font-code-lg text-code-lg opacity-80 hover:opacity-100 transition-opacity">
        <div className="flex gap-xl">
          <Stat value={stats.wpm} unit="wpm" />
          <Stat value={`${stats.accuracy.toFixed(0)}%`} unit="acc" />
        </div>
        <Stat value={timeReadout} unit={mode === "time" ? "remaining" : "elapsed"} />
      </div>
    </div>
  );
}

function Stat({ value, unit }: { value: string | number; unit: string }) {
  return (
    <div className="flex items-baseline gap-sm">
      <span className="text-tertiary text-3xl tabular-nums">{value}</span>
      <span className="font-ui-label text-on-surface-variant lowercase">{unit}</span>
    </div>
  );
}

function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function GlobeGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="w-4 h-4"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

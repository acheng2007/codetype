"use client";

import type { Mode, TimeDuration } from "@/lib/types";

type Props = {
  mode: Mode;
  duration: TimeDuration;
  onModeChange: (mode: Mode) => void;
  onDurationChange: (d: TimeDuration) => void;
  dimmed?: boolean;
};

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "time", label: "time", icon: "⏱" },
  { id: "snippet", label: "snippet", icon: "❝" },
  { id: "zen", label: "zen", icon: "∞" },
];

const DURATIONS: TimeDuration[] = [30, 60];

export function ModeSelector({
  mode,
  duration,
  onModeChange,
  onDurationChange,
  dimmed,
}: Props) {
  return (
    <div
      className={`flex items-center gap-md bg-surface-container-high rounded-full px-6 py-2 font-code-sm text-code-sm text-on-surface-variant transition-opacity duration-200 ${
        dimmed ? "opacity-30" : "opacity-100"
      }`}
    >
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`flex items-center gap-xs px-1 transition-colors ${
              active
                ? "text-primary"
                : "hover:text-on-surface"
            }`}
          >
            <span aria-hidden>{m.icon}</span> {m.label}
          </button>
        );
      })}
      {mode === "time" && (
        <>
          <span className="w-px h-4 bg-outline-variant mx-xs" aria-hidden />
          {DURATIONS.map((d) => {
            const active = d === duration;
            return (
              <button
                key={d}
                onClick={() => onDurationChange(d)}
                className={`px-1 transition-colors ${
                  active ? "text-primary" : "hover:text-on-surface"
                }`}
              >
                {d}
              </button>
            );
          })}
        </>
      )}
    </div>
  );
}

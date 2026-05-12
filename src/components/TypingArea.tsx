"use client";

import { memo } from "react";
import type { CharState, TargetChar } from "@/lib/types";

type Props = {
  targets: TargetChar[];
  states: CharState[];
  cursor: number;
  focused: boolean;
};

/**
 * Renders the snippet character-by-character, preserving newlines and
 * indentation. The caret is rendered as an absolute-positioned bar in front
 * of the next typeable character.
 *
 * We split rendering by line so that the layout is `whitespace-pre` and the
 * caret can sit inline without breaking the monospaced grid.
 */
function TypingAreaImpl({ targets, states, cursor, focused }: Props) {
  // Group targets by line for stable line rendering.
  const lines: TargetChar[][] = [];
  for (const t of targets) {
    if (lines.length <= t.line) lines.push([]);
    lines[t.line].push(t);
  }

  return (
    <div
      className="font-code-lg text-code-lg leading-relaxed whitespace-pre font-normal break-words text-surface-bright select-none max-w-3xl mx-auto"
      aria-label="Typing area"
    >
      {lines.map((lineChars, li) => (
        <div key={li} className="relative">
          {lineChars.map((tc) => {
            const isCursor = tc.index === cursor;
            const state = states[tc.index];
            return (
              <Char
                key={tc.index}
                tc={tc}
                state={state}
                isCursor={isCursor}
                focused={focused}
              />
            );
          })}
          {/* End-of-line caret rendering: when the cursor sits on the newline
              token at end-of-line, render it after the last visible char. */}
          {lineChars.length > 0 &&
            lineChars[lineChars.length - 1].char === "\n" &&
            cursor === lineChars[lineChars.length - 1].index && (
              <span className="inline-block w-0 align-middle" aria-hidden />
            )}
        </div>
      ))}
      {/* End-of-snippet caret sentinel */}
      {cursor >= targets.length && (
        <div className="h-0" aria-label="End of snippet" />
      )}
    </div>
  );
}

function Char({
  tc,
  state,
  isCursor,
  focused,
}: {
  tc: TargetChar;
  state: CharState;
  isCursor: boolean;
  focused: boolean;
}) {
  const isNewline = tc.char === "\n";
  const isSkip = tc.kind === "skip";

  // Caret rendered as a left-edge vertical bar in front of the next typeable
  // character. We use a wrapping span with `relative` so the caret can sit
  // absolutely without affecting the monospace grid.
  if (isNewline) {
    // Render the newline char itself with an optional caret marker before
    // line break occurs (purely visual; the actual line break is the `<br />`).
    return (
      <>
        {isCursor && (
          <span className="relative inline-block align-middle">
            <Caret focused={focused} />
          </span>
        )}
        <br />
      </>
    );
  }

  const display = tc.char;
  const colorClass = (() => {
    if (isSkip) return "text-surface-bright";
    if (state === "correct") return "text-on-surface";
    if (state === "incorrect") return "text-error border-b-2 border-error";
    return "text-surface-bright";
  })();

  if (isCursor) {
    return (
      <span className="relative inline-block">
        <Caret focused={focused} />
        <span className={colorClass}>{display === " " ? "\u00A0" : display}</span>
      </span>
    );
  }

  return <span className={colorClass}>{display === " " ? "\u00A0" : display}</span>;
}

function Caret({ focused }: { focused: boolean }) {
  return (
    <span
      className={`absolute left-0 top-0 w-[2px] h-full bg-primary caret-glow z-10 ${
        focused ? "animate-pulse-caret" : "opacity-40"
      }`}
      aria-hidden
    />
  );
}

export const TypingArea = memo(TypingAreaImpl);

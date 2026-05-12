"use client";

import type { TestResult } from "@/lib/types";

type Props = {
  result: TestResult;
  personalBest: number;
  onRestart: () => void;
  onNext: () => void;
};

export function ResultsScreen({ result, personalBest, onRestart, onNext }: Props) {
  const isPb = result.wpm > 0 && result.wpm >= personalBest;
  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in flex flex-col items-center gap-xl py-lg">
      <div className="flex flex-col items-center gap-sm">
        <span className="font-ui-label text-on-surface-variant tracking-widest uppercase">
          {isPb ? "new personal best" : "test complete"}
        </span>
        <div className="flex items-baseline gap-md">
          <span className="font-display-code text-tertiary text-[96px] leading-none tabular-nums">
            {result.wpm}
          </span>
          <span className="font-ui-label text-on-surface-variant">wpm</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-lg w-full">
        <Stat label="accuracy" value={`${result.accuracy.toFixed(1)}%`} />
        <Stat label="consistency" value={`${result.consistency}%`} />
        <Stat label="raw wpm" value={result.rawWpm} />
        <Stat label="time" value={`${(result.elapsedMs / 1000).toFixed(1)}s`} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-lg w-full font-code-sm text-code-sm text-on-surface-variant">
        <MiniStat label="correct" value={result.correctChars} />
        <MiniStat label="incorrect" value={result.incorrectChars} />
        <MiniStat label="keystrokes" value={result.totalKeystrokes} />
        <MiniStat label="mode" value={modeLabel(result)} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-md mt-md">
        <Button onClick={onNext} primary>
          next test
          <Kbd>tab</Kbd>
          <span className="opacity-60">+</span>
          <Kbd>enter</Kbd>
        </Button>
        <Button onClick={onRestart}>restart same</Button>
      </div>
    </div>
  );
}

function modeLabel(r: TestResult): string {
  if (r.mode === "time") return `time ${r.duration}s`;
  return r.mode;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-xs">
      <span className="font-display-code text-tertiary text-[40px] leading-none tabular-nums">
        {value}
      </span>
      <span className="font-ui-label text-on-surface-variant uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between border-b border-outline-variant/40 pb-xs">
      <span className="opacity-60">{label}</span>
      <span className="text-on-surface tabular-nums">{value}</span>
    </div>
  );
}

function Button({
  children,
  onClick,
  primary,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primary?: boolean;
}) {
  const base =
    "inline-flex items-center gap-sm px-md py-sm rounded font-ui-header text-ui-header transition-colors";
  const variant = primary
    ? "border border-primary text-primary hover:bg-primary hover:text-on-primary"
    : "border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline";
  return (
    <button onClick={onClick} className={`${base} ${variant}`}>
      {children}
    </button>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-code-sm text-code-sm px-xs py-px rounded border border-outline-variant/60 text-on-surface-variant">
      {children}
    </span>
  );
}

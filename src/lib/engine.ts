import type {
  CharState,
  Keystroke,
  Language,
  Mode,
  TargetChar,
  TestResult,
} from "./types";

/**
 * Build the list of expected characters for a snippet under "Smart" whitespace mode.
 *
 * Rules (per PRD §6.4):
 *  - Leading whitespace on every line is auto-skipped (kind: "skip").
 *  - Everything else is typeable, including the newline at end-of-line.
 *  - The trailing newline after the very last non-empty line is dropped to avoid
 *    forcing users to press Enter on completion.
 */
export function buildTargets(code: string): TargetChar[] {
  const targets: TargetChar[] = [];
  const lines = code.split("\n");

  // Trim a single trailing empty line if the snippet ended with "\n".
  if (lines.length > 1 && lines[lines.length - 1] === "") lines.pop();

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    let col = 0;
    let i = 0;
    while (i < line.length && (line[i] === " " || line[i] === "\t")) {
      targets.push({
        index: targets.length,
        char: line[i],
        kind: "skip",
        line: li,
        col,
      });
      col++;
      i++;
    }
    while (i < line.length) {
      targets.push({
        index: targets.length,
        char: line[i],
        kind: "typeable",
        line: li,
        col,
      });
      col++;
      i++;
    }
    if (li < lines.length - 1) {
      targets.push({
        index: targets.length,
        char: "\n",
        kind: "typeable",
        line: li,
        col,
      });
    }
  }
  return targets;
}

export interface EngineState {
  targets: TargetChar[];
  states: CharState[];
  cursor: number;
  keystrokes: Keystroke[];
  startedAt: number | null;
  finishedAt: number | null;
  completed: boolean;
}

export function createEngineState(code: string): EngineState {
  const targets = buildTargets(code);
  const states: CharState[] = targets.map(() => "pending");
  const initialCursor = advancePastSkips(targets, 0);
  return {
    targets,
    states,
    cursor: initialCursor,
    keystrokes: [],
    startedAt: null,
    finishedAt: null,
    completed: targets.length === 0,
  };
}

function advancePastSkips(targets: TargetChar[], from: number): number {
  let i = from;
  while (i < targets.length && targets[i].kind === "skip") i++;
  return i;
}

function retreatPastSkips(targets: TargetChar[], from: number): number {
  let i = from;
  while (i > 0 && targets[i - 1].kind === "skip") i--;
  return i;
}

/**
 * Apply a single key event to the engine state. Returns a new state object
 * (pure-ish — `keystrokes` and `states` arrays are mutated for perf, but
 * callers should treat returned state as new).
 */
export function applyKey(state: EngineState, key: string, now: number): EngineState {
  if (state.completed) return state;
  if (state.cursor >= state.targets.length) return state;

  // Normalize the key into the expected char domain.
  let typed: string | null = null;
  if (key === "Backspace") {
    if (state.cursor === 0) return state;
    // Step back one typeable position, walking past any skip chars in between.
    const prev = retreatPastSkips(state.targets, state.cursor) - 1;
    if (prev < 0) return state;
    const newStates = state.states.slice();
    newStates[prev] = "pending";
    return { ...state, cursor: prev, states: newStates };
  }
  if (key === "Enter") typed = "\n";
  else if (key === "Tab") typed = "\t";
  else if (key.length === 1) typed = key;
  else return state;

  const target = state.targets[state.cursor];
  const correct = typed === target.char;

  const newStates = state.states.slice();
  newStates[state.cursor] = correct ? "correct" : "incorrect";

  const startedAt = state.startedAt ?? now;
  const keystrokes = state.keystrokes.concat({
    key: typed,
    t: now,
    correct,
    targetIndex: state.cursor,
  });

  let cursor = state.cursor + 1;
  cursor = advancePastSkips(state.targets, cursor);
  const completed = cursor >= state.targets.length;

  return {
    ...state,
    states: newStates,
    cursor,
    keystrokes,
    startedAt,
    finishedAt: completed ? now : state.finishedAt,
    completed,
  };
}

/** Force-complete the engine (used when Time mode timer expires). */
export function completeEngine(state: EngineState, now: number): EngineState {
  if (state.completed) return state;
  return { ...state, completed: true, finishedAt: now };
}

/**
 * Aggregate stats. Excludes auto-skipped whitespace from both the numerator
 * and denominator (Smart-mode honest scoring).
 */
export interface ComputedStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  elapsedMs: number;
}

const MIN_DURATION_MS = 250;

export function computeStats(state: EngineState, now: number): ComputedStats {
  const start = state.startedAt;
  const end = state.finishedAt ?? now;
  const elapsedMs = start != null ? Math.max(end - start, 0) : 0;

  let correctChars = 0;
  let incorrectChars = 0;
  for (let i = 0; i < state.targets.length; i++) {
    if (state.targets[i].kind === "skip") continue;
    if (state.states[i] === "correct") correctChars++;
    else if (state.states[i] === "incorrect") incorrectChars++;
  }
  const totalKeystrokes = state.keystrokes.length;
  const accuracyDenominator = totalKeystrokes;
  const correctKeystrokes = state.keystrokes.reduce(
    (n, k) => n + (k.correct ? 1 : 0),
    0,
  );
  const accuracy =
    accuracyDenominator === 0 ? 0 : correctKeystrokes / accuracyDenominator;

  const minutes = Math.max(elapsedMs, MIN_DURATION_MS) / 60_000;
  const wpm = correctChars / 5 / minutes;
  const rawWpm = totalKeystrokes / 5 / minutes;

  const consistency = consistencyFromKeystrokes(state.keystrokes);

  return {
    wpm: Math.round(wpm),
    rawWpm: Math.round(rawWpm),
    accuracy: Math.round(accuracy * 1000) / 10,
    consistency,
    correctChars,
    incorrectChars,
    totalKeystrokes,
    elapsedMs,
  };
}

/**
 * Consistency = 100 * (1 - σ/μ) over per-second WPM samples, clamped to [0, 100].
 * Returns 0 when there's not enough signal.
 */
function consistencyFromKeystrokes(keystrokes: Keystroke[]): number {
  if (keystrokes.length < 2) return 0;
  const t0 = keystrokes[0].t;
  const buckets = new Map<number, number>();
  for (const k of keystrokes) {
    if (!k.correct) continue;
    const sec = Math.floor((k.t - t0) / 1000);
    buckets.set(sec, (buckets.get(sec) ?? 0) + 1);
  }
  const samples = Array.from(buckets.values()).map((charsInSec) => charsInSec * 12);
  if (samples.length < 2) return 0;
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  if (mean === 0) return 0;
  const variance =
    samples.reduce((acc, v) => acc + (v - mean) ** 2, 0) / samples.length;
  const std = Math.sqrt(variance);
  const cov = std / mean;
  const consistency = Math.max(0, Math.min(100, (1 - cov) * 100));
  return Math.round(consistency);
}

export function buildResult(
  state: EngineState,
  stats: ComputedStats,
  config: { mode: Mode; duration: number; language: Language; snippetIds: string[] },
): TestResult {
  return {
    id: cryptoRandomId(),
    timestamp: Date.now(),
    mode: config.mode,
    duration: config.duration,
    language: config.language,
    snippetIds: config.snippetIds,
    wpm: stats.wpm,
    rawWpm: stats.rawWpm,
    accuracy: stats.accuracy,
    consistency: stats.consistency,
    correctChars: stats.correctChars,
    incorrectChars: stats.incorrectChars,
    totalKeystrokes: stats.totalKeystrokes,
    elapsedMs: stats.elapsedMs,
  };
}

function cryptoRandomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

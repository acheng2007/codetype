import type { TestResult } from "./types";

const STORAGE_KEY = "codetype:history:v1";
const MAX_ENTRIES = 50;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadHistory(): TestResult[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as TestResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: TestResult): TestResult[] {
  if (!isBrowser()) return [];
  const existing = loadHistory();
  const next = [result, ...existing].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota errors etc. are non-fatal.
  }
  return next;
}

export function clearHistory(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(STORAGE_KEY);
}

export function personalBestWpm(history: TestResult[]): number {
  return history.reduce((best, r) => Math.max(best, r.wpm), 0);
}

export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "cpp"
  | "rust"
  | "go"
  | "java";

export type Mode = "time" | "snippet" | "zen";

export type TimeDuration = 30 | 60;

export interface TestConfig {
  mode: Mode;
  duration?: TimeDuration;
  language: Language;
}

export interface Snippet {
  id: string;
  language: Language;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  source: "curated" | "oss" | "user" | "ai";
  license: string;
  attribution: string | null;
  code: string;
}

export type CharKind = "typeable" | "skip";

export interface TargetChar {
  index: number;
  char: string;
  kind: CharKind;
  line: number;
  col: number;
}

export type CharState = "pending" | "correct" | "incorrect";

export interface Keystroke {
  key: string;
  t: number;
  correct: boolean;
  targetIndex: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: Mode;
  duration: number;
  language: Language;
  snippetIds: string[];
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  elapsedMs: number;
}

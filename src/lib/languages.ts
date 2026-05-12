import type { Language } from "./types";

/** Order matches stitch `04-typing-arena-language-menu`. */
export const LANGUAGES_UI_ORDER: Language[] = [
  "typescript",
  "python",
  "javascript",
  "cpp",
  "rust",
  "go",
  "java",
];

const LABELS: Record<Language, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  cpp: "C++",
  rust: "Rust",
  go: "Go",
  java: "Java",
};

export function languageDisplayName(lang: Language): string {
  return LABELS[lang];
}

export function languageMatchesQuery(lang: Language, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const name = languageDisplayName(lang).toLowerCase();
  return name.includes(needle) || lang.includes(needle);
}

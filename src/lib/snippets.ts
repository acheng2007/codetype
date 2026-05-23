import { javascriptSnippets } from "@/data/snippets/javascript";
import type { Language, Snippet } from "./types";

/** Snippet bodies are JS for now; other languages reuse the pool until dedicated sets ship. */
const BY_LANGUAGE: Record<Language, Snippet[]> = {
  javascript: javascriptSnippets,
  typescript: javascriptSnippets,
  python: javascriptSnippets,
  cpp: javascriptSnippets,
  rust: javascriptSnippets,
  go: javascriptSnippets,
  java: javascriptSnippets,
};

function withTypingLanguage(s: Snippet, language: Language): Snippet {
  return { ...s, language };
}

export function snippetsFor(language: Language): Snippet[] {
  return BY_LANGUAGE[language] ?? [];
}

/**
 * Pick a random snippet, avoiding `excludeId` if possible. Uses an in-memory
 * Fisher-Yates for selection.
 */
export function randomSnippet(
  language: Language,
  excludeId?: string,
): Snippet {
  const pool = snippetsFor(language);
  if (pool.length === 0) throw new Error(`No snippets for ${language}`);
  if (pool.length === 1) return withTypingLanguage(pool[0], language);
  const filtered =
    excludeId != null ? pool.filter((s) => s.id !== excludeId) : pool;
  const idx = Math.floor(Math.random() * filtered.length);
  return withTypingLanguage(filtered[idx], language);
}

const MEDIUM_LINE_BOUNDS = { min: 5, max: 18 };

function mediumPool(language: Language, excludeId?: string): Snippet[] {
  return snippetsFor(language).filter((s) => {
    const lines = s.code.split("\n").filter(Boolean).length;
    return (
      lines >= MEDIUM_LINE_BOUNDS.min &&
      lines <= MEDIUM_LINE_BOUNDS.max &&
      s.id !== excludeId
    );
  });
}

/** Stable snippet for SSR/hydration; random selection runs client-side after mount. */
export function defaultMediumSnippet(language: Language): Snippet {
  const pool = mediumPool(language);
  const source = pool.length > 0 ? pool : snippetsFor(language);
  const sorted = [...source].sort((a, b) => a.id.localeCompare(b.id));
  return withTypingLanguage(sorted[0], language);
}

export function randomMediumSnippet(
  language: Language,
  excludeId?: string,
): Snippet {
  const pool = mediumPool(language, excludeId);
  if (pool.length === 0) return randomSnippet(language, excludeId);
  return withTypingLanguage(
    pool[Math.floor(Math.random() * pool.length)],
    language,
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Footer } from "./Footer";
import { LanguageMenu } from "./LanguageMenu";
import { LiveStats } from "./LiveStats";
import { ModeSelector } from "./ModeSelector";
import { ResultsScreen } from "./ResultsScreen";
import { TopBar } from "./TopBar";
import { TypingArea } from "./TypingArea";
import {
  applyKey,
  buildResult,
  completeEngine,
  computeStats,
  createEngineState,
  type EngineState,
} from "@/lib/engine";
import { loadHistory, personalBestWpm, saveResult } from "@/lib/history";
import { randomMediumSnippet, randomSnippet } from "@/lib/snippets";
import type {
  Language,
  Mode,
  Snippet,
  TestResult,
  TimeDuration,
} from "@/lib/types";

type Phase = "idle" | "running" | "finished";

export function Arena() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("snippet");
  const [duration, setDuration] = useState<TimeDuration>(30);
  const [snippet, setSnippet] = useState<Snippet>(() =>
    randomMediumSnippet("javascript"),
  );
  const [snippetIds, setSnippetIds] = useState<string[]>([]);
  const [engine, setEngine] = useState<EngineState>(() =>
    createEngineState(snippet.code),
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [now, setNow] = useState<number>(() => performance.now());
  const [result, setResult] = useState<TestResult | null>(null);
  const [personalBest, setPersonalBest] = useState<number>(0);
  const [focused, setFocused] = useState<boolean>(true);

  const captureRef = useRef<HTMLInputElement | null>(null);

  // Load PB from history on mount.
  useEffect(() => {
    setPersonalBest(personalBestWpm(loadHistory()));
  }, []);

  // Keep an "elapsed" tick going while running so we can detect time-up.
  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(id);
  }, [phase]);

  // Auto-focus the capture input.
  useEffect(() => {
    captureRef.current?.focus();
  }, []);

  // Reset the engine whenever the snippet or mode changes (and we're not mid-test).
  const reset = useCallback(
    (nextSnippet?: Snippet) => {
      const s = nextSnippet ?? snippet;
      setSnippet(s);
      setSnippetIds([s.id]);
      setEngine(createEngineState(s.code));
      setResult(null);
      setPhase("idle");
      setNow(performance.now());
      captureRef.current?.focus();
    },
    [snippet],
  );

  const startNext = useCallback(() => {
    const next = mode === "time"
      ? randomSnippet(language, snippet.id)
      : randomMediumSnippet(language, snippet.id);
    reset(next);
  }, [mode, snippet.id, reset, language]);

  // Switch mode / duration / language → fresh test.
  useEffect(() => {
    const next =
      mode === "time"
        ? randomSnippet(language, snippet.id)
        : randomMediumSnippet(language, snippet.id);
    setSnippet(next);
    setSnippetIds([next.id]);
    setEngine(createEngineState(next.code));
    setResult(null);
    setPhase("idle");
    setNow(performance.now());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, duration, language]);

  // Compute remaining time in Time mode.
  const remainingMs = useMemo(() => {
    if (mode !== "time") return null;
    if (engine.startedAt == null) return duration * 1000;
    return duration * 1000 - (now - engine.startedAt);
  }, [mode, duration, engine.startedAt, now]);

  // In Time mode, end when the clock hits zero.
  useEffect(() => {
    if (phase !== "running" || mode !== "time" || remainingMs == null) return;
    if (remainingMs <= 0) {
      const completed = completeEngine(engine, performance.now());
      finishTest(completed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, phase, mode]);

  // In Time mode, when the current snippet completes (cursor at end), chain
  // immediately into the next snippet, preserving the engine's timer.
  useEffect(() => {
    if (
      phase === "running" &&
      mode === "time" &&
      engine.cursor >= engine.targets.length &&
      remainingMs != null &&
      remainingMs > 0
    ) {
      const next = randomSnippet(language, snippet.id);
      // Chain: build a new engine for the next snippet, but keep startedAt.
      const chained = createEngineState(next.code);
      const continued: EngineState = {
        ...chained,
        startedAt: engine.startedAt,
        keystrokes: engine.keystrokes,
      };
      setSnippet(next);
      setSnippetIds((ids) => [...ids, next.id]);
      setEngine(continued);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.cursor, engine.targets.length, phase, mode]);

  // In Snippet / Zen modes, finish when the snippet completes.
  useEffect(() => {
    if (
      phase === "running" &&
      mode !== "time" &&
      engine.completed
    ) {
      finishTest(engine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.completed, phase, mode]);

  function finishTest(finalEngine: EngineState) {
    const stats = computeStats(finalEngine, performance.now());
    const r = buildResult(finalEngine, stats, {
      mode,
      duration: mode === "time" ? duration : Math.round(stats.elapsedMs / 1000),
      language,
      snippetIds,
    });
    const updated = saveResult(r);
    setResult(r);
    setPersonalBest(personalBestWpm(updated));
    setPhase("finished");
  }

  // Global key handling — fed by the offscreen input + a window-level fallback.
  const handleKey = useCallback(
    (key: string) => {
      // Tab + Enter combo restarts the test.
      // We approximate: Enter pressed while Tab is held is hard to capture
      // reliably as a single key event, so we treat a bare Tab as "restart"
      // when the test is finished, and prevent default for plain Tab while
      // running so it doesn't steal focus.
      if (key === "__restart__") {
        startNext();
        return;
      }
      if (phase === "finished") return;
      if (phase === "idle") setPhase("running");
      const t = performance.now();
      setEngine((prev) => applyKey(prev, key, t));
    },
    [phase, startNext],
  );

  // Keyboard listener via the hidden input. We use a controlled input bound
  // to "" and capture keydown for full control over Enter/Tab/Backspace.
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Tab+Enter restart shortcut.
    if (e.key === "Enter" && e.shiftKey === false && tabHeldRef.current) {
      e.preventDefault();
      handleKey("__restart__");
      return;
    }
    // Plain Escape → reset current snippet to start.
    if (e.key === "Escape") {
      e.preventDefault();
      reset(snippet);
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      tabHeldRef.current = true;
      return;
    }
    if (
      e.key === "Backspace" ||
      e.key === "Enter" ||
      e.key.length === 1
    ) {
      e.preventDefault();
      handleKey(e.key);
    }
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Tab") tabHeldRef.current = false;
  }

  const tabHeldRef = useRef(false);
  const wasLanguageMenuOpen = useRef(false);

  useEffect(() => {
    if (wasLanguageMenuOpen.current && !languageMenuOpen) {
      queueMicrotask(() => captureRef.current?.focus());
    }
    wasLanguageMenuOpen.current = languageMenuOpen;
  }, [languageMenuOpen]);

  // Live stats for the header.
  const liveStats = useMemo(() => computeStats(engine, now), [engine, now]);

  const dimChrome = phase === "running" || languageMenuOpen;

  return (
    <>
      <TopBar dimmed={dimChrome} />
      <main
        className="flex-grow flex flex-col items-center justify-center px-gutter md:px-lg w-full max-w-container-max mx-auto py-xl gap-xl"
        onClick={() => captureRef.current?.focus()}
      >
        <input
          ref={captureRef}
          className="capture-input"
          aria-hidden
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value=""
          onChange={() => {}}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {phase !== "finished" && (
          <ModeSelector
            mode={mode}
            duration={duration}
            onModeChange={setMode}
            onDurationChange={setDuration}
            dimmed={dimChrome}
          />
        )}

        {phase !== "finished" ? (
          <>
            <LiveStats
              language={language}
              mode={mode}
              duration={duration}
              startedAt={engine.startedAt}
              finishedAt={engine.finishedAt}
              stats={liveStats}
              remainingMs={remainingMs}
              active={phase === "running"}
              languageMenuOpen={languageMenuOpen}
              onOpenLanguageMenu={() => {
                captureRef.current?.blur();
                setLanguageMenuOpen(true);
              }}
            />
            <TypingArea
              targets={engine.targets}
              states={engine.states}
              cursor={engine.cursor}
              focused={focused}
            />
            <div className="flex flex-col items-center gap-sm text-on-surface-variant opacity-60">
              <button
                type="button"
                aria-label="Restart"
                onClick={(e) => {
                  e.stopPropagation();
                  reset(snippet);
                }}
                className="p-2 hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-high"
              >
                <RestartGlyph />
              </button>
              <div className="text-xs">
                <Kbd>tab</Kbd> + <Kbd>enter</Kbd> — next snippet ·{" "}
                <Kbd>esc</Kbd> — restart
              </div>
              {personalBest > 0 && phase === "idle" && (
                <div className="text-xs opacity-70">
                  pb · <span className="text-tertiary">{personalBest}</span> wpm
                </div>
              )}
            </div>
          </>
        ) : (
          result && (
            <ResultsScreen
              result={result}
              personalBest={personalBest}
              onRestart={() => reset(snippet)}
              onNext={startNext}
            />
          )
        )}
      </main>
      <Footer dimmed={dimChrome} />
      <LanguageMenu
        open={languageMenuOpen}
        onOpenChange={setLanguageMenuOpen}
        value={language}
        onChange={setLanguage}
      />
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-code-sm px-xs py-px rounded border border-outline-variant/60 text-on-surface-variant">
      {children}
    </span>
  );
}

function RestartGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

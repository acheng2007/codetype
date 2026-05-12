# CodeType — Product Requirements Document

| Field | Value |
| --- | --- |
| Product name | **CodeType** (wordmark `code_type`) |
| Tagline | _Monkeytype, for code._ |
| Document version | 0.1 (draft) |
| Last updated | 2026-05-12 |
| Owner | Adam |
| Status | Draft — pending review |

> **About this document.** This PRD captures the problem, scope, requirements, and high-level architecture for CodeType. It is written assumption-first: defaults are based on the existing design system and Stitch export in this repo; anything marked **[Assumption]** is a decision you should validate or override.

---

## 1. Overview

### 1.1 Vision
CodeType is a typing-speed practice app built specifically for code. It takes the addictive, flow-inducing loop of [Monkeytype](https://monkeytype.com) — restart, type, see score, restart — and applies it to the one thing developers type all day: actual source code, in actual programming languages, with the indentation, brackets, and symbol density that real code carries.

### 1.2 Why it exists
Generic typing tests train you on English prose. Developers spend their day typing a different alphabet: `=>`, `{}`, `::`, `<T>`, `===`, indentation, camelCase, and snake_case. CodeType is the deliberate-practice tool that closes that gap, and a habit-forming benchmark that's _fun_ enough to come back to.

### 1.3 One-line product description
A minimalist, terminal-aesthetic web app where developers race to type real code snippets across multiple programming languages, measured in WPM and accuracy, with a leaderboard and personal-history tracking.

---

## 2. Problem & opportunity

### 2.1 Problems we solve
1. **Typing tests don't reflect coding.** Monkeytype, 10fastfingers, and TypeRacer measure prose speed. None of them measure how fast you write `const x = users.filter(u => u.isActive).map(u => u.id)`.
2. **No fun way to drill code typing.** Existing "type code" tools (e.g. Speed Coder, typing.io) exist but feel dated, lack the polish and feedback loop of Monkeytype, and have weak language coverage.
3. **No social/competitive layer for code typing.** Developers love leaderboards (Advent of Code, Codewars). There's no equivalent for raw code-typing speed.

### 2.2 Opportunity
- Monkeytype has **millions of monthly users** and is one of the most-loved minimal web apps in dev culture. A "for code" spinoff has obvious organic appeal on r/programming, Hacker News, and dev Twitter.
- The product is **content-light** (snippets + scoring), so it can be built and launched quickly.
- It naturally creates **viral artifacts** (share-your-score cards, language-specific leaderboards).

---

## 3. Goals & non-goals

### 3.1 Goals (v1.0)
- **G1.** Deliver a typing test that _feels native to code_ — handling indentation, brackets, and special characters gracefully.
- **G2.** Match Monkeytype's restart-loop fluidity: ≤200 ms from key-down to test reset; zero modal friction.
- **G3.** Ship with at least **3 programming languages** and a curated library of 100+ snippets per language.
- **G4.** Provide WPM, accuracy, and consistency metrics that are credible to developers (i.e., handle whitespace honestly — see §6.4).
- **G5.** Be installable as a PWA and work fully offline for solo practice.

### 3.2 Non-goals (v1.0)
- **NG1.** Multiplayer racing (a la TypeRacer). _Tracked for post-v1.0._
- **NG2.** Real code execution / "did the code run?" validation. CodeType measures typing, not correctness reasoning.
- **NG3.** A full IDE feature set (intellisense, refactoring). The app deliberately strips chrome — see design principles.
- **NG4.** Native mobile apps. Web + PWA only for v1.

---

## 4. Target audience

### 4.1 Personas

**P1 — "The Daily Driller" (primary)**
Mid-level developer, 3–7 yrs experience. Already uses Monkeytype occasionally. Wants a 5-minute warm-up routine before standups. Cares about: WPM trend over time, personal best, accuracy.

**P2 — "The Junior Improving" (secondary)**
Bootcamp grad or CS student. Slow on symbols and keyboard shortcuts. Wants targeted practice on a specific language they're learning. Cares about: language coverage, accessible snippets, encouragement.

**P3 — "The Competitive Show-off" (secondary)**
Speed-typing enthusiast or competitive coder. Already in the top 1% on Monkeytype. Wants a new leaderboard to dominate. Cares about: global leaderboard, share cards, exotic languages/symbols.

### 4.2 Anti-personas
- Recruiters or hiring managers expecting a coding-skill assessment.
- Beginners who don't yet touch-type — CodeType assumes baseline typing literacy.

---

## 5. Success metrics

| Tier | Metric | v1.0 target (90 days post-launch) |
| --- | --- | --- |
| **North star** | Weekly active users (WAU) | 5,000 |
| Engagement | Median tests/session | ≥ 4 |
| Engagement | D7 retention (signed-in) | ≥ 25% |
| Quality | Median test completion rate | ≥ 80% |
| Quality | p75 input latency (keystroke → render) | ≤ 16 ms |
| Growth | Share-card clicks / completed test | ≥ 5% |
| Trust | Reported leaderboard cheat incidents / 1k tests | < 1 |

---

## 6. Product principles & key decisions

### 6.1 Principles
1. **One screen, one job.** The arena is the product. Everything else is secondary.
2. **No chrome in flow.** When the user is typing, UI fades. When they're done, it returns.
3. **Honest scoring.** WPM and accuracy match a developer's intuition — no inflated numbers from auto-completed brackets.
4. **Keyboard-first.** Every primary action is a shortcut. Mouse is optional.
5. **Fast first paint, fast restart.** The app must feel like a terminal, not an SPA.

### 6.2 [Assumption] Scope tier
Building **v1.0** (MVP + accounts + leaderboard) over ~6–10 weeks. MVP (§9.1) ships first to a small audience; v1.0 follows once we validate the typing-loop UX. Override if you want a stricter MVP-only scope.

### 6.3 [Assumption] Tech stack
- **Frontend:** Next.js 15 (App Router) + React + TypeScript + Tailwind CSS (config already exists in `stitch-export/`).
- **Auth + DB:** Supabase (Postgres + Auth + Row Level Security). Free tier carries early traffic.
- **Hosting:** Vercel.
- **State:** Zustand or React Context for arena state; React Query for server data.
- **Analytics:** PostHog (self-host or cloud) for events; Sentry for errors.

Rationale: matches the Tailwind config already exported from Stitch, supports SSR for SEO on snippet pages, and gets accounts + leaderboard live with one backend dependency. Override if you have a strong preference (Vite-only frontend, SvelteKit, etc.).

### 6.4 [Assumption — critical] Whitespace & brackets behavior
**Default: "Smart" mode.** This is the single most important UX decision for a code typing test.

- **Auto-indent on Enter.** When the user presses Enter, the caret jumps to the correct indent column for the next line; the user does **not** retype leading whitespace.
- **Auto-skip leading whitespace** on the first line of a snippet.
- **Brackets, quotes, parens: typed manually.** No auto-close. Typing `{` requires later typing `}`. This keeps scoring honest and rewards real symbol fluency — the whole point of the product.
- **Tab key** advances to the next non-whitespace character (never inserts whitespace).
- **Newlines count as 1 character** for WPM purposes.

Settings will expose two alternatives, but Smart is the default:
- _Strict:_ user types every space and newline.
- _IDE:_ Smart + auto-close brackets/quotes (easiest; lower scores).

Override if you want a different default — this affects scoring formulas (§8.3) and the input engine (§11).

### 6.5 [Assumption] Snippet sourcing for v1.0
- **MVP:** ~100 hand-curated snippets per language, stored in-repo as JSON. Covers idioms (loops, async, classes, regex, error handling).
- **v1.0:** Add "Quote mode" for longer (30–150 line) real-world snippets pulled from MIT/Apache-licensed OSS repos, attributed inline.
- **Post-v1.0:** User submissions with moderation; AI-generated snippets at requested difficulty.

### 6.6 [Assumption] Account model
**Anonymous-first.** Anyone can take a test instantly with zero friction. Sign-up is offered only when the user (a) finishes a test that would make a leaderboard or (b) clicks "Save my history." Anonymous results persist via `localStorage` and are migrated on sign-up.

---

## 7. User flows

### 7.1 First-time visitor (happy path)
1. User lands on `/`. Page loads in <1 s; a JavaScript snippet is preloaded.
2. User starts typing immediately. Timer starts on first keystroke.
3. Live stats bar fades in at 25% opacity (per design).
4. User finishes → results screen reveals WPM, accuracy, consistency, time.
5. CTA: "Save your score" (sign-up prompt) and "Restart" (Tab+Enter).

### 7.2 Returning signed-in user
1. Lands on `/`. Last-used language + mode are restored.
2. Stats bar shows personal best.
3. After test, result is appended to history; chart on profile updates.

### 7.3 Mode / language switch
1. User clicks language pill ("javascript") → command-palette-style menu appears (matches Stitch screen 04).
2. User searches or arrows to "python" → Enter.
3. Snippet hot-swaps without page reload; test resets.

### 7.4 Leaderboard discovery
1. User clicks the trophy icon in nav → `/leaderboard`.
2. Default view: top 100 _today_, filterable by language + mode + duration.
3. User's own row is pinned at the bottom if they're not in the top 100.

---

## 8. Functional requirements

### 8.1 Test modes (matches existing design)
| Mode | Description | Default |
| --- | --- | --- |
| **Time** | Type as much as possible in N seconds (15 / 30 / 60 / 120). Snippets cycle. | 30 s |
| **Snippet** | Complete a single snippet of a chosen length (XS/S/M/L/XL by line count). | M (~15 lines) |
| **Quote** | Long real-world OSS snippet, 30–150 lines, single run. | — |
| **Zen** | Free-form typing of any snippet with no timer; just clean drills. | — |
| **Custom** | User pastes their own code. Saved as a private snippet on their account. | — |

> _Note: "words" mode from Monkeytype is replaced by "snippet" — words don't make sense for code._

### 8.2 Languages — v1.0 launch set [Assumption]
1. **JavaScript / TypeScript** (treated as one language with separate snippet pools)
2. **Python**
3. **Go**
4. **Rust** _(stretch)_

Post-v1.0 candidates: Java, C/C++, C#, Ruby, HTML/CSS, SQL, Bash, Lua, Kotlin, Swift, Haskell.

Each language ships with:
- ≥100 curated snippets, tagged by topic and difficulty (1–5).
- A syntax-highlighting grammar (via Shiki or Prism).
- A symbol-density score used for difficulty calibration.

### 8.3 Scoring
- **WPM** = (correct characters / 5) / minutes. Standard formula.
- **Raw WPM** = (all characters typed / 5) / minutes.
- **Accuracy** = correct chars / total chars typed.
- **Consistency** = `100 × (1 − σ/μ)` over per-word WPM samples (Monkeytype-style).
- **Auto-indented whitespace is excluded** from both numerator and denominator (Smart mode) to prevent inflation.

### 8.4 Input engine (must-have behaviors)
- IME-safe (handles macOS dead keys, composition events).
- Correctly displays: live caret (vertical bar with neon glow per design), in-flight wrong character (red underline), already-typed text dimmed.
- Restart shortcut: `Tab + Enter`. Hard reset on `Esc + Esc`.
- "Stuck character" indicator: after 3 consecutive wrong attempts on the same character, briefly highlight the correct key with a hint (toggleable in settings).
- No backspace through completed words by default (toggleable).
- Pasting is **blocked** during an active test.

### 8.5 Results screen (matches Stitch screen 03)
Must display:
- WPM (large, primary color), accuracy %, consistency %, time elapsed.
- Character chart: correct / incorrect / extra / missed.
- WPM curve over the test duration.
- Snippet metadata: language, source, license, difficulty.
- Actions: Restart (same snippet), New (different snippet), Share, Save.

### 8.6 Share card
- Canvas-rendered PNG (1200×630) showing WPM, accuracy, language, snippet preview, and `code_type` wordmark.
- Open Graph + Twitter card metadata on `/results/:id` for unfurls.

### 8.7 Leaderboard
- Tables segmented by: language × mode × duration. (e.g. "JavaScript, Time, 60 s").
- Time windows: Today / This week / All time.
- Anti-cheat (v1.0 baseline):
  - Server-side timing reconciliation (keystrokes must arrive at plausible inter-key intervals).
  - Rate-limit submissions per IP / account.
  - Reject scores above a per-language ceiling (e.g. 250 WPM) pending manual review.
  - All submissions store a compressed keystroke log for after-the-fact audit.

### 8.8 Account features
- Sign in with **GitHub** (primary), Google, Email magic link.
- Profile page: total tests, average WPM by language, PR by mode, 90-day chart.
- Settings: theme (default Terminal Focus, future themes Pluggable), whitespace mode, sound (key clicks / error beeps), font size, smooth caret on/off.
- Account deletion + data export (CSV of test history).

### 8.9 PWA / offline
- Installable manifest with `code_type` icon.
- Service worker caches app shell + last 200 snippets per chosen language.
- Anonymous results queue locally and sync on reconnect.

---

## 9. Scope & milestones

### 9.1 MVP (weeks 0–3)
- Single page arena, no accounts.
- One language: **JavaScript**, ~100 snippets.
- Modes: Time (30/60), Snippet (M only), Zen.
- Smart whitespace mode only (no settings panel yet).
- Results screen with WPM / accuracy / consistency.
- `localStorage` history (last 50 tests).
- Deploy to Vercel at `codetype.app` (or chosen domain).

**Done when:** A new visitor can land, type a JS snippet, see honest stats, and restart in under 5 seconds.

### 9.2 v1.0 (weeks 4–8)
- Supabase auth (GitHub + Google).
- Cloud-synced history; profile page.
- 3 languages live (JS/TS, Python, Go).
- All five test modes.
- Settings panel with whitespace, sound, font controls.
- Leaderboard with anti-cheat v1.
- Share cards + Open Graph.
- PWA install + offline.

**Done when:** Public launch on Hacker News / Reddit with a stable leaderboard and zero P0 bugs for 7 days.

### 9.3 Post-v1.0 (future)
- Multiplayer races (rooms of 2–5, real-time).
- "Daily challenge" snippet (same for everyone, leaderboard reset daily).
- User-submitted snippets with moderation queue.
- AI-generated snippets at requested difficulty.
- Additional languages (Rust, Java, C++, SQL, HTML/CSS).
- Themes marketplace.
- Practice mode: targeted drills on weakest symbols / bigrams.
- Browser extension: "type the code in this Stack Overflow answer."

---

## 10. UX & visual design

Design system, screens, and design tokens already exist in this repo:

- Design system: `stitch-export/codetype/01-design-system/DESIGN.md`
- Arena screen: `stitch-export/codetype/02-typing-arena-language-annotated/`
- Results screen: `stitch-export/codetype/03-results-dashboard-updated-header/`
- Language menu: `stitch-export/codetype/04-typing-arena-language-menu/`

Implementation must adhere to:
- **Typography:** JetBrains Mono for code/data, Geist for UI.
- **Palette:** `#10141a` background, neon green primary `#6fdd78`, cyan secondary `#7bd0ff`, amber tertiary `#f9bd22`.
- **Caret:** vertical bar, 2 px wide, primary color, 10 px glow, pulsing 1 s.
- **Depth:** tonal layers, no shadows except the caret glow.
- **Motion:** ≤200 ms transitions; never block input.

Accessibility:
- All actions keyboard-reachable.
- Color contrast meets WCAG AA against the dark background for body text (AAA for inactive text is acceptable to be slightly low — by design — but must be opt-out via "high contrast" setting).
- Caret motion respects `prefers-reduced-motion` (replace pulse with steady cursor).
- Screen-reader live region announces final results.

---

## 11. Technical architecture

### 11.1 High-level
```
┌──────────────────────────────────────────────┐
│  Browser (Next.js client)                    │
│   ├─ Arena (input engine, scoring)           │
│   ├─ Service worker (PWA, snippet cache)     │
│   └─ Zustand store                           │
└──────────────────────────────────────────────┘
                ▲       │
                │ tRPC  │
                ▼
┌──────────────────────────────────────────────┐
│  Next.js server (Vercel functions)           │
│   ├─ Submission validator + rate limit       │
│   ├─ Leaderboard queries                     │
│   └─ Snippet API                             │
└──────────────────────────────────────────────┘
                ▲       │
                │       ▼
┌──────────────────────────────────────────────┐
│  Supabase (Postgres + Auth)                  │
│   ├─ users, results, snippets, languages     │
│   └─ Row-level security per user             │
└──────────────────────────────────────────────┘
```

### 11.2 Input engine
- Listens on a hidden `<textarea>` (for IME) overlaid on the rendered snippet.
- Per-keystroke event records: `{ char, timestamp, correct }`.
- Stream is the source of truth for both rendering and final scoring.
- Render layer is pure: takes `(snippet, keystrokeLog, mode)` → JSX. No imperative DOM.

### 11.3 Snippet format
```json
{
  "id": "js-fib-recursive",
  "language": "javascript",
  "title": "Recursive Fibonacci",
  "difficulty": 2,
  "tags": ["recursion", "math"],
  "source": "curated",
  "license": "MIT",
  "attribution": null,
  "code": "function fib(n) {\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}\n"
}
```

### 11.4 Data model (Postgres)
- `users(id, handle, email, created_at, settings_jsonb)`
- `languages(id, slug, name, color)`
- `snippets(id, language_id, title, code, difficulty, source, license, attribution)`
- `results(id, user_id nullable, snippet_id, mode, duration_s, wpm, raw_wpm, accuracy, consistency, keystroke_log_compressed, created_at, ip_hash)`
- `leaderboard_view` (materialized view, refreshed every 60 s)

### 11.5 Performance budget
- LCP < 1.5 s on a cold load over 4G.
- JS bundle < 150 kB gzipped on the arena route.
- Input latency p75 < 16 ms (one frame at 60 Hz).

---

## 12. Analytics & telemetry

Events to capture (PostHog):
- `arena.opened {language, mode}`
- `test.started {snippet_id, language, mode}`
- `test.completed {wpm, accuracy, consistency, duration_s, ...}`
- `test.abandoned {chars_typed, elapsed_s}`
- `restart.pressed`
- `language.changed {from, to}`
- `signup.prompted` / `signup.completed`
- `leaderboard.viewed {language, mode, window}`
- `share.clicked {channel}`

Funnels to monitor:
- Land → first keystroke → first completion → restart → second completion.
- First completion → share → return next day.

---

## 13. Risks & open questions

| # | Risk / Question | Mitigation |
| --- | --- | --- |
| R1 | "Smart whitespace" feels wrong to purists. | Settings toggle for Strict mode; document the trade-off transparently. |
| R2 | Leaderboard cheating with macros / scripts. | Server-side timing validation; keystroke log audit; per-language WPM ceilings. |
| R3 | Snippet quality varies; some snippets feel unfair (giant generated strings, etc.). | Curation guidelines; user "report snippet" button; auto-exclude from leaderboards on N reports. |
| R4 | Mobile experience is inherently bad for code typing. | v1.0: gracefully degrade to a "preview only" view on mobile; explicit "desktop recommended" banner. |
| R5 | Indentation rules differ across languages (tabs vs spaces, 2 vs 4). | Snippet metadata declares indent style; engine respects it. |
| OQ1 | Is `codetype.app` / `code-type.dev` available as a domain? | Check & reserve. |
| OQ2 | Open-source the project or proprietary? | Affects contribution model and snippet submissions. |
| OQ3 | Monetization (none / donations / Pro tier)? | Out of scope for v1.0; revisit at 10k WAU. |
| OQ4 | Sound design — silent by default or subtle key clicks? | Default off; opt-in mechanical-keyboard sample. |

---

## 14. Appendix

### 14.1 Assumptions log (please review)
1. **Scope:** v1.0 with MVP as week-3 milestone. _(§6.2)_
2. **Stack:** Next.js + Tailwind + Supabase. _(§6.3)_
3. **Whitespace handling:** Smart by default; auto-indent on Enter, no auto-close brackets. _(§6.4)_
4. **Languages at launch:** JS/TS, Python, Go (Rust stretch). _(§8.2)_
5. **Snippets:** Curated in-repo for MVP; OSS + AI-generated later. _(§6.5)_
6. **Accounts:** Anonymous-first; sign-up gated on save/leaderboard intent. _(§6.6)_
7. **Sound:** Off by default. _(§8.8)_
8. **Mobile:** Web-responsive but desktop-first; no native apps. _(§3.2)_

### 14.2 Glossary
- **WPM** — Words per minute. 1 word = 5 characters.
- **Raw WPM** — WPM counting all keystrokes (including errors).
- **Consistency** — Coefficient of variation of per-word WPM, mapped to 0–100.
- **Snippet** — A self-contained code block, 5–150 lines, tagged by language and difficulty.
- **Arena** — The primary single-screen view where a test runs.

### 14.3 References
- Monkeytype — https://monkeytype.com (UX inspiration; not a clone)
- Typing.io (defunct) — first-mover in code typing
- Speed Coder — current competitor
- Existing design tokens — `stitch-export/codetype/01-design-system/DESIGN.md`

---

_Next step: review §14.1 assumptions and either confirm them or comment in-line so we can lock the PRD and start §9.1 (MVP)._

import {
  applyKey,
  buildTargets,
  computeStats,
  createEngineState,
} from "../src/lib/engine";

let failed = 0;
function assert(cond: unknown, msg: string) {
  if (!cond) {
    console.error("  FAIL:", msg);
    failed++;
  } else {
    console.log("  ok:", msg);
  }
}

// 1. Leading whitespace is auto-skipped.
{
  const code = "  hi\n  bye\n";
  const targets = buildTargets(code);
  const typeable = targets.filter((t) => t.kind === "typeable").map((t) => t.char);
  assert(
    typeable.join("") === "hi\nbye",
    "auto-skip leading whitespace on every line; newline is typeable",
  );
}

// 2. Engine cursor starts past leading whitespace.
{
  const s = createEngineState("  hello\n");
  assert(s.cursor === 2, "cursor starts past 2 leading spaces");
}

// 3. Typing the full snippet correctly yields 100% accuracy and the engine completes.
{
  let s = createEngineState("hi\n");
  let t = 0;
  for (const ch of ["h", "i", "Enter"]) {
    t += 100;
    s = applyKey(s, ch, t);
  }
  assert(s.completed, "engine completes after typing all chars + Enter");
  const stats = computeStats(s, t);
  assert(stats.accuracy === 100, `accuracy is 100, got ${stats.accuracy}`);
  assert(stats.correctChars === 3, `correct chars = 3 (h,i,\\n), got ${stats.correctChars}`);
}

// 4. After Enter, the cursor auto-skips next line leading whitespace.
{
  let s = createEngineState("a\n  b\n");
  // expected targets: a, \n, (skip), (skip), b, \n
  let t = 0;
  s = applyKey(s, "a", (t += 100));
  // After "a" (index 0 -> 1), cursor is on \n.
  assert(s.cursor === 1, "cursor on newline after typing 'a'");
  s = applyKey(s, "Enter", (t += 100));
  // After Enter, cursor should skip to index 4 ('b'), past the two spaces.
  assert(s.cursor === 4, `cursor jumps over 2 leading spaces, got ${s.cursor}`);
}

// 5. Incorrect typing increments incorrect chars and accuracy reflects it.
{
  let s = createEngineState("ab\n");
  let t = 0;
  s = applyKey(s, "x", (t += 100));
  s = applyKey(s, "b", (t += 100));
  s = applyKey(s, "Enter", (t += 100));
  const stats = computeStats(s, t);
  assert(stats.correctChars === 2, `correct = 2, got ${stats.correctChars}`);
  assert(stats.incorrectChars === 1, `incorrect = 1, got ${stats.incorrectChars}`);
  assert(stats.accuracy < 100, "accuracy < 100 when one typo");
}

// 6. Backspace moves cursor back to the previous typeable position.
{
  let s = createEngineState("ab\n");
  let t = 0;
  s = applyKey(s, "a", (t += 100));
  s = applyKey(s, "b", (t += 100));
  s = applyKey(s, "Backspace", (t += 100));
  assert(s.cursor === 1, `backspace from index 2 -> 1, got ${s.cursor}`);
}

// 7. Brackets are NOT auto-closed — must be typed manually.
{
  let s = createEngineState("function f() {}\n");
  let t = 0;
  for (const ch of "function f() {}") {
    s = applyKey(s, ch, (t += 50));
  }
  s = applyKey(s, "Enter", (t += 50));
  assert(s.completed, "completes only after typing every bracket including '}'");
  const stats = computeStats(s, t);
  assert(stats.accuracy === 100, "no auto-bracket inflation — 100% accuracy when typed perfectly");
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`);
  process.exit(1);
}
console.log("\nall engine assertions passed");

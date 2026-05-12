import type { Snippet } from "@/lib/types";

/**
 * Curated JavaScript snippets for the MVP.
 *
 * Difficulty 1-2: short, common idioms.
 * Difficulty 3:   ~10-20 lines, moderate symbol density.
 * Difficulty 4-5: 20+ lines, heavy symbols / async / generics-feel.
 *
 * All snippets are original, public-domain, and ASCII-only.
 */
export const javascriptSnippets: Snippet[] = [
  {
    id: "js-fib-recursive",
    language: "javascript",
    title: "Recursive Fibonacci",
    difficulty: 2,
    tags: ["recursion", "math"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}
`,
  },
  {
    id: "js-array-sum",
    language: "javascript",
    title: "Sum reducer",
    difficulty: 1,
    tags: ["array", "reduce"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `const sum = (xs) => xs.reduce((a, b) => a + b, 0);
`,
  },
  {
    id: "js-filter-map",
    language: "javascript",
    title: "Filter then map",
    difficulty: 2,
    tags: ["array", "functional"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `const activeIds = users
  .filter((u) => u.isActive)
  .map((u) => u.id);
`,
  },
  {
    id: "js-debounce",
    language: "javascript",
    title: "Debounce",
    difficulty: 4,
    tags: ["closure", "timing"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function debounce(fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}
`,
  },
  {
    id: "js-throttle",
    language: "javascript",
    title: "Throttle",
    difficulty: 4,
    tags: ["closure", "timing"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}
`,
  },
  {
    id: "js-deep-clone",
    language: "javascript",
    title: "Structured clone helper",
    difficulty: 3,
    tags: ["object", "utility"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function clone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(clone);
  const out = {};
  for (const key of Object.keys(value)) {
    out[key] = clone(value[key]);
  }
  return out;
}
`,
  },
  {
    id: "js-fetch-json",
    language: "javascript",
    title: "Fetch JSON with timeout",
    difficulty: 4,
    tags: ["async", "fetch"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `async function getJSON(url, ms = 5000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}
`,
  },
  {
    id: "js-event-emitter",
    language: "javascript",
    title: "Tiny event emitter",
    difficulty: 4,
    tags: ["class", "events"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `class Emitter {
  constructor() {
    this.handlers = new Map();
  }
  on(event, fn) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event).add(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    this.handlers.get(event)?.delete(fn);
  }
  emit(event, payload) {
    this.handlers.get(event)?.forEach((fn) => fn(payload));
  }
}
`,
  },
  {
    id: "js-quicksort",
    language: "javascript",
    title: "Quicksort",
    difficulty: 3,
    tags: ["sort", "recursion"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function quicksort(arr) {
  if (arr.length <= 1) return arr;
  const [pivot, ...rest] = arr;
  const left = rest.filter((x) => x < pivot);
  const right = rest.filter((x) => x >= pivot);
  return [...quicksort(left), pivot, ...quicksort(right)];
}
`,
  },
  {
    id: "js-binary-search",
    language: "javascript",
    title: "Binary search",
    difficulty: 3,
    tags: ["search", "loop"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function binarySearch(arr, target) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}
`,
  },
  {
    id: "js-promise-all-settled",
    language: "javascript",
    title: "Settle all promises",
    difficulty: 4,
    tags: ["async", "promise"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `async function settleAll(tasks) {
  return Promise.all(
    tasks.map(async (t) => {
      try {
        return { status: "ok", value: await t() };
      } catch (err) {
        return { status: "err", error: err };
      }
    }),
  );
}
`,
  },
  {
    id: "js-group-by",
    language: "javascript",
    title: "Group by key",
    difficulty: 3,
    tags: ["array", "object"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item);
    (acc[key] ||= []).push(item);
    return acc;
  }, {});
}
`,
  },
  {
    id: "js-memoize",
    language: "javascript",
    title: "Memoize",
    difficulty: 3,
    tags: ["closure", "cache"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
`,
  },
  {
    id: "js-clamp",
    language: "javascript",
    title: "Clamp",
    difficulty: 1,
    tags: ["math"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
`,
  },
  {
    id: "js-range",
    language: "javascript",
    title: "Range generator",
    difficulty: 2,
    tags: ["generator", "iterator"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}
`,
  },
  {
    id: "js-pluck",
    language: "javascript",
    title: "Pluck",
    difficulty: 1,
    tags: ["array", "object"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `const pluck = (xs, key) => xs.map((x) => x[key]);
`,
  },
  {
    id: "js-uniq",
    language: "javascript",
    title: "Unique values",
    difficulty: 1,
    tags: ["array", "set"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `const uniq = (xs) => [...new Set(xs)];
`,
  },
  {
    id: "js-zip",
    language: "javascript",
    title: "Zip two arrays",
    difficulty: 2,
    tags: ["array"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function zip(a, b) {
  const len = Math.min(a.length, b.length);
  const out = [];
  for (let i = 0; i < len; i++) {
    out.push([a[i], b[i]]);
  }
  return out;
}
`,
  },
  {
    id: "js-flatten",
    language: "javascript",
    title: "Flatten deep",
    difficulty: 3,
    tags: ["array", "recursion"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function flatten(arr) {
  return arr.reduce(
    (out, v) => out.concat(Array.isArray(v) ? flatten(v) : v),
    [],
  );
}
`,
  },
  {
    id: "js-retry",
    language: "javascript",
    title: "Retry with backoff",
    difficulty: 5,
    tags: ["async", "retry"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `async function retry(fn, attempts = 3, baseMs = 200) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      await new Promise((r) => setTimeout(r, baseMs * 2 ** i));
    }
  }
  throw last;
}
`,
  },
  {
    id: "js-react-counter",
    language: "javascript",
    title: "React counter component",
    difficulty: 3,
    tags: ["react", "jsx"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function Counter() {
  const [n, setN] = useState(0);
  return (
    <button onClick={() => setN(n + 1)}>
      count is {n}
    </button>
  );
}
`,
  },
  {
    id: "js-regex-email",
    language: "javascript",
    title: "Email regex check",
    difficulty: 2,
    tags: ["regex", "string"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `const isEmail = (s) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(s);
`,
  },
  {
    id: "js-pipe",
    language: "javascript",
    title: "Function pipe",
    difficulty: 2,
    tags: ["functional", "compose"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
`,
  },
  {
    id: "js-linked-list",
    language: "javascript",
    title: "Linked list reverse",
    difficulty: 4,
    tags: ["linked-list", "loop"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function reverse(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}
`,
  },
  {
    id: "js-todo-reducer",
    language: "javascript",
    title: "Todo reducer",
    difficulty: 3,
    tags: ["reducer", "immutable"],
    source: "curated",
    license: "PUBLIC-DOMAIN",
    attribution: null,
    code: `function todos(state = [], action) {
  switch (action.type) {
    case "add":
      return [...state, { id: action.id, text: action.text, done: false }];
    case "toggle":
      return state.map((t) =>
        t.id === action.id ? { ...t, done: !t.done } : t,
      );
    case "remove":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}
`,
  },
];

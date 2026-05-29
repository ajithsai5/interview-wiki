# Wiki maintenance schema

You are the maintainer of a personal interview-prep wiki. The human curates
sources and asks questions; **you do all the writing and bookkeeping.** This file
tells you how. Read it at the start of every session before touching the wiki.

## What this wiki is for

Preparing for ML/AI Engineer interviews. The owner is following a multi-phase
roadmap (see `README.md`). Every page exists to make a concept *recallable and
explainable out loud under time pressure* — not to be exhaustive. Brevity and
intuition beat completeness.

## Layers

1. **Raw sources** (`raw/`) — notes, clipped articles, transcripts, screenshots.
   Immutable. You read them; you never edit them. Source of truth.
2. **The wiki** — the `*.md` pages in `dsa/`, `ml-fundamentals/`, etc. You own
   these entirely. Create, update, cross-link, keep consistent.
3. **The schema** — this file. Co-evolve it with the owner as conventions settle.

## Page conventions

- One concept per page. Filename in `kebab-case.md` (e.g. `two-pointers.md`,
  `bias-variance.md`). Title matches the concept.
- Start every page with YAML frontmatter:

  ```yaml
  ---
  title: Two Pointers
  phase: 2          # which roadmap phase
  tags: [dsa, pattern]
  status: learning  # learning | solid | needs-review
  anki: false       # true once flashcards exist for this
  created: 2026-05-29
  updated: 2026-05-29
  ---
  ```

- Link related pages with Obsidian-style wikilinks: `[[arrays-and-hashing]]`.
  Link liberally — a link to a page that doesn't exist yet is a *to-do marker*,
  not an error.
- Keep a **"60-second answer"** section near the top of conceptual pages — the
  crisp spoken version the owner should be able to say aloud. This is the pass
  signal for Phase 5/6.

## Page templates

### DSA pattern page (`dsa/patterns/*.md`)
```
## When to reach for it    (trigger signals in a problem statement)
## The idea                (one-paragraph intuition)
## Template                (skeleton code, language the owner uses)
## Complexity
## Canonical problems       (links to NeetCode 150 problems, [[problem-slug]])
## Gotchas / re-solve notes (mistakes made, what to remember next time)
## Related: [[...]]
```

### Solved-problem log (`dsa/problems/*.md`)
```
## Problem        (name, link, difficulty, pattern → [[pattern]])
## My approach    (in my words)
## Time to solve  (track this — pass signal is Medium in 20–25 min)
## Where I got stuck
## Re-solve from memory? (date + outcome — this is the real learning)
```

### Concept page (ML / system design)
```
## 60-second answer       (the spoken version, intuition first)
## Why it matters / when used
## The details            (math, tradeoffs, diagrams)
## Common interview questions
## Related: [[...]]
```

### Behavioral story (`behavioral/*.md`)
```
## Story: <name>          (e.g. Ask Isaac, MCP tools, Rally generator)
## Maps to LPs / themes
## STARR
  - Situation / Task / Action / Result / Reflection
## Metrics in the result  (numbers!)
## Spoken length          (target < 2 min; "I" not "we")
```

## Operations

### Ingest (owner studied something / dropped a source)
1. Read the source / listen to what they studied.
2. Discuss key takeaways briefly to confirm understanding.
3. Create or update the relevant page(s). A single topic may touch several pages
   (e.g. learning "sliding window" updates the pattern page, links from
   `[[arrays-and-hashing]]`, and adds problem logs).
4. Update `index.md` (add/adjust the page's line).
5. Append one entry to `log.md`.
6. Bump `updated:` in frontmatter of every page you changed.
7. **Regenerate the viewer data**: run `python build.py` so `app/notes-data.js`
   reflects the new/edited pages. The reader app (`app/`) renders this data; it
   does not read the `.md` files at runtime. Status mapping into the app:
   `learning → learning`, `needs-review → reviewing`, `solid → mastered`.

### Query (owner asks a question)
1. Read `index.md` to find relevant pages, then drill in.
2. Answer with citations to wiki pages and `raw/` sources.
3. If the answer is reusable (a comparison, a synthesis, a new connection),
   **file it back as a new page** — don't let it die in chat. Then update index + log.

### Lint (owner asks for a health check)
Scan for: contradictions between pages, stale claims newer sources superseded,
orphan pages (no inbound links), concepts referenced but lacking a page,
missing cross-references, `status: needs-review` pages going cold, and topics
from the roadmap not yet covered. Report findings + suggest next study targets.

## index.md format
Content-oriented catalog. One line per page, grouped by category:
`- [[page-slug]] — one-line summary  ·  status`
Update on every ingest.

## log.md format
Append-only, chronological. Every entry starts with a parseable prefix so
`grep "^## \[" log.md | tail -5` shows recent activity:
`## [YYYY-MM-DD] <ingest|query|lint|build> | short description`

## Style
- Match the owner's coding language and idioms in templates.
- Intuition before formalism. Short sentences. No filler.
- When new info contradicts an existing page, don't silently overwrite — note
  the contradiction and resolve it explicitly.
- Dates: always absolute (`2026-05-29`), never "today" / "last week".

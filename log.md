# Log

Append-only timeline. Each entry: `## [YYYY-MM-DD] <type> | description`.
Recent activity: `grep "^## \[" log.md | tail -5`

## [2026-05-29] build | Scaffolded the wiki — schema (CLAUDE.md), index, README, and two example pages: [[arrays-and-hashing]] and [[bias-variance]].
## [2026-05-29] build | Added the wiki viewer app (app/) from the Claude Design handoff — warm-paper editorial reader with sidebar nav, search, status tracking + spaced-review queue. build.py generates app/notes-data.js from the .md notes; run.bat builds + opens it.
## [2026-05-29] build | Bundled the design's 46 seed sample notes into app/content/ (merged, user notes win on id clash) and fixed the review-queue "20600d overdue" bug (seeded-but-unreviewed notes now show "ready").
## [2026-05-29] ingest | Authored the Arrays interview-prep track: 14 pages in dsa/arrays/ ([[arrays-00-roadmap]] hub + 13 sections from basics → DP), each with ASCII diagrams, worked examples, code, complexity, practice problems, and pitfalls. Cross-linked to seed notes ([[two-pointers]], [[binary-search]], [[hashing]], [[graphs]], [[heaps]]) and [[arrays-and-hashing]].

# Log

Append-only timeline. Each entry: `## [YYYY-MM-DD] <type> | description`.
Recent activity: `grep "^## \[" log.md | tail -5`

## [2026-05-29] build | Scaffolded the wiki — schema (CLAUDE.md), index, README, and two example pages: [[arrays-and-hashing]] and [[bias-variance]].
## [2026-05-29] build | Added the wiki viewer app (app/) from the Claude Design handoff — warm-paper editorial reader with sidebar nav, search, status tracking + spaced-review queue. build.py generates app/notes-data.js from the .md notes; run.bat builds + opens it.
## [2026-05-29] build | Bundled the design's 46 seed sample notes into app/content/ (merged, user notes win on id clash) and fixed the review-queue "20600d overdue" bug (seeded-but-unreviewed notes now show "ready").
## [2026-05-29] ingest | Authored the Arrays interview-prep track: 14 pages in dsa/arrays/ ([[arrays-00-roadmap]] hub + 13 sections from basics → DP), each with ASCII diagrams, worked examples, code, complexity, practice problems, and pitfalls. Cross-linked to seed notes ([[two-pointers]], [[binary-search]], [[hashing]], [[graphs]], [[heaps]]).
## [2026-05-29] ingest | Authored the Hashing track: 7 pages in dsa/hashing/ ([[hashing-00-roadmap]] hub + fundamentals, frequency map, set lookup, complement/index map, prefix+hashmap, strings & window). Removed the old combined arrays-and-hashing note and repointed its links to the new tracks. Reorganized dsa/ into per-topic folders (arrays/, hashing/).
## [2026-05-29] build | Viewer now shows sub-folders: build.py emits a `group` (the sub-folder name) and the sidebar renders collapsible sub-groups within a domain (DSA → Arrays / Hashing / Core Concepts). Domains without sub-folders stay flat. Added ?v= cache-buster to styles/app links.
## [2026-05-29] edit | Set all 14 Arrays + 7 Hashing pages to status: new (not started yet) — they were seeded as "learning". Regenerated notes-data.js.
## [2026-05-29] build | Moved Coding / DSA to the top of the sidebar (order 0). Added mobile support: build.py --serve serves the viewer over LAN + serve-mobile.bat + README "Run it on your phone" section. Bumped app.js cache-buster to v3.

# Log

Append-only timeline. Each entry: `## [YYYY-MM-DD] <type> | description`.
Recent activity: `grep "^## \[" log.md | tail -5`

## [2026-05-29] build | Scaffolded the wiki — schema (CLAUDE.md), index, README, and two example pages: [[arrays-and-hashing]] and [[bias-variance]].
## [2026-05-29] build | Added the wiki viewer app (app/) from the Claude Design handoff — warm-paper editorial reader with sidebar nav, search, status tracking + spaced-review queue. build.py generates app/notes-data.js from the .md notes; run.bat builds + opens it.

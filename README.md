# Interview Prep Wiki

A personal, LLM-maintained knowledge base for my ML/AI Engineer interview prep.

This is not a notes dump. It's a **compounding wiki**: I learn something, drop my
raw notes/sources in `raw/`, and the LLM agent integrates them into structured,
interlinked markdown pages — updating cross-references, flagging contradictions,
and keeping the index and log current. The knowledge is compiled once and kept
current, not re-derived every time I ask a question.

- **I** curate sources, ask questions, and decide what to study (per my roadmap).
- **The LLM** does the bookkeeping: summarizing, cross-referencing, filing, indexing.
- **Obsidian** is the reader (open this folder as a vault); the LLM is the writer.

## Run the wiki viewer

A self-contained reader app turns these markdown notes into a browsable,
searchable wiki with per-note status tracking (New → Learning → Reviewing →
Mastered) and a spaced-review queue — built for the "learn and relearn" loop.

**To open it:** double-click **`run.bat`** (Windows). One click rebuilds the wiki
from your notes, **opens it on this laptop**, and **serves it to your phone** — a
URL like `http://192.168.x.x:8765/` is printed; open that on your phone (same
Wi-Fi). Keep the window open while using it; close it (or press `Ctrl+C`) to stop.

From a terminal you can also run `python build.py` (just rebuild),
`python build.py --open` (rebuild + open locally, no server), or
`python build.py --serve --open` (exactly what `run.bat` does).

`build.py` scans the note folders, reads each note's frontmatter + body, and
regenerates `app/notes-data.js` — the data the viewer reads. **Re-run it whenever
you add or edit notes.** Progress (statuses, review history) is stored locally in
your browser; your notes stay the source of truth as plain `.md` files.

## Run it on your phone

`run.bat` already serves it to your phone. It prints a URL like
`http://192.168.x.x:8765/` — open that in your phone's browser on the **same
Wi-Fi**. The viewer is mobile-responsive (it collapses to a hamburger menu). If
the phone can't connect, allow Python through Windows Firewall when prompted, and
make sure the laptop isn't on a separate "Guest" network. The IP can change when
you reconnect Wi-Fi; `run.bat` always prints the current one. Progress marked on
the phone stays in the phone's browser unless you set up sync below.

### Install it as an app + sync across devices

For an **installable, offline app** on your phone whose **status/progress syncs
between phone and laptop**, see **[MOBILE-SETUP.md](MOBILE-SETUP.md)**. It uses a
free Firebase project (Firestore) for sync + a free static host for the install.
Until you configure it, the app runs in local-only mode (progress per-browser) —
the PWA install + offline reading already work without any of that.

## Layout

```
interview-wiki/
  CLAUDE.md            # the schema: how the LLM maintains this wiki (read this first)
  index.md             # catalog of every page, by category
  log.md               # append-only timeline of ingests / queries / lint passes
  build.py             # scans .md notes -> generates app/notes-data.js
  run.bat              # double-click: build + open the viewer (Windows)
  app/                 # the wiki viewer (index.html, styles.css, app.js, notes-data.js)
  raw/                 # immutable source material (notes, articles, transcripts)
  dsa/                 # Phase 2 & 4 — coding/DSA topic tracks
    arrays/            #   Arrays roadmap (00 hub + 13 sections)
    hashing/           #   Hashing roadmap (00 hub + 6 sections)
    problems/          #   solved-problem logs
  ml-fundamentals/     # Phase 5 — bias-variance, attention, RAG, LoRA, etc.
  system-design/       # Phase 6 — ML system design framework + whiteboard designs
  behavioral/          # Phase 7 — STAR/STARR stories, Amazon LPs
  recruiter-hm/        # Phase 3 & 8 — company research, negotiation
```

## The roadmap this serves

| Phase | Focus | Wiki home |
|-------|-------|-----------|
| 2 + 4 | DSA / NeetCode 150 (180+ problems by Wk 10) | `dsa/` |
| 5 | ML/AI fundamentals (Anki, 60-sec answers) | `ml-fundamentals/` |
| 6 | ML system design (6-step framework) | `system-design/` |
| 1 | Resume / GitHub portfolio (building, not notes) | tracked in `log.md` |
| 7 | Behavioral (10 STAR stories) | `behavioral/` |
| 3 + 8 | Recruiter + HM (why-this-team, negotiation) | `recruiter-hm/` |

## How to use it day to day

1. Tell the agent what you studied today (paste notes, a link, or just talk).
2. The agent files it: writes/updates the topic page, links related pages,
   updates `index.md`, appends to `log.md`.
3. Browse in Obsidian — follow links, check the graph view.
4. Periodically ask the agent to **lint** the wiki (find gaps, stale claims, orphans).

See `CLAUDE.md` for the full maintenance protocol.

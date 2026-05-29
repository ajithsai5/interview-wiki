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

## Layout

```
interview-wiki/
  CLAUDE.md            # the schema: how the LLM maintains this wiki (read this first)
  index.md             # catalog of every page, by category
  log.md               # append-only timeline of ingests / queries / lint passes
  raw/                 # immutable source material (notes, articles, transcripts)
  dsa/                 # Phase 2 & 4 — patterns + solved-problem logs
    patterns/
    problems/
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

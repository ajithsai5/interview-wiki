---
title: Intervals 00 · Roadmap
phase: 2
tags: [dsa, intervals, roadmap, index]
group: Intervals
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
Problems with **ranges `[start, end]`** that can overlap: merging bookings, meeting
rooms, "can I attend all?", inserting a range. The move is almost always **sort by
start, then sweep once**.

## The path
1. [[intervals-01-basics]] — overlap test, merge intervals, can-attend-all
2. [[intervals-02-advanced]] — insert interval, min meeting rooms, non-overlapping (greedy)

## Pattern → reach-for-it
| Clue | Use |
|---|---|
| "merge overlapping ranges" | sort by start, extend — [[intervals-01-basics]] |
| "insert a new range" | before / merge / after — [[intervals-02-advanced]] |
| "minimum rooms / max concurrency" | sweep or heap of ends — [[intervals-02-advanced]] |
| "max non-overlapping / min removals" | sort by **end**, greedy keep |

## Related
- It's [[arrays-07-sorting|sorting]] + a greedy sweep ([[arrays-11-greedy]]); rooms use a [[heap-00-roadmap|heap]]

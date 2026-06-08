---
title: Heap 00 · Roadmap
phase: 2
tags: [dsa, heap, priority-queue, roadmap, index]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
A **heap** (priority queue) always hands you the smallest/largest item in **O(1)**,
with O(log n) insert/remove. Reach for it on "top-K", "K-th", "merge K", "median of a
stream", and "repeatedly take the best".

## The path
1. [[heap-01-basics]] — the heap property, `heapq`, push/pop/heapify, max-heap trick
2. [[heap-02-top-k]] — the size-K heap pattern (top-K, K-th, K closest)
3. [[heap-03-advanced]] — two-heaps (running median), merge-K, scheduling

## Pattern → reach-for-it
| Clue | Use |
|---|---|
| "top K / K-th largest/smallest" | size-K heap — [[heap-02-top-k]] |
| "merge K sorted …" | heap of heads — [[heap-03-advanced]] |
| "median so far / from a stream" | two heaps — [[heap-03-advanced]] |
| "schedule / always take the best next" | max-heap of priorities |

## Related
- Often follows [[hashing-02-frequency-map|frequency counting]] (Top-K); merge-K uses [[linked-list-00-roadmap|linked lists]]; alternative to size-K heap is quickselect ([[arrays-07-sorting]])

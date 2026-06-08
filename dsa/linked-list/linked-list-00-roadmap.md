---
title: Linked List 00 · Roadmap
phase: 2
tags: [dsa, linked-list, roadmap, index]
group: Linked List
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
Linked-list problems test **pointer manipulation**, not cleverness. Master five moves
and you can do almost all of them: **traverse, dummy head, reverse, fast/slow,
merge**.

## The path
1. [[linked-list-01-basics]] — nodes, traversal, the dummy-head trick, insert/delete
2. [[linked-list-02-reverse-fastslow]] — reverse a list; fast/slow for middle & cycles
3. [[linked-list-03-advanced]] — merge, reorder, remove-Nth, add numbers, LRU cache

## Pattern → reach-for-it
| Clue | Move |
|---|---|
| "reverse", "in-place flip" | reverse — [[linked-list-02-reverse-fastslow]] |
| "middle", "cycle", "nth from end" | fast/slow pointers |
| "merge", "first node may change" | dummy head — [[linked-list-01-basics]] |
| "LRU / O(1) insert+delete by key" | hashmap + doubly linked list — [[linked-list-03-advanced]] |

## Related
- Fast/slow is [[arrays-03-two-pointers|two pointers]] on nodes; LRU pairs with [[hashing-00-roadmap|hashing]]; Merge-K uses a [[heap-00-roadmap|heap]]

---
title: Strings 00 · Roadmap
phase: 2
tags: [dsa, strings, roadmap, index]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
Strings are **arrays of characters**, so the array patterns carry over — plus a few
string-specific ones. Work the pages in order; each goes from the idea to a code
template to canonical problems.

## The path
1. [[strings-01-basics]] — what a string is, immutability, building output, common ops
2. [[strings-02-two-pointers-window]] — palindromes (two pointers) + substring problems (sliding window)
3. [[strings-03-frequency-advanced]] — anagrams (frequency maps) + expand-around-center + encode/decode

## Pattern → reach-for-it
| Clue | Technique | Page |
|---|---|---|
| "palindrome", "reverse", compare ends | two pointers | [[strings-02-two-pointers-window]] |
| "substring such that…", "longest/shortest window" | sliding window | [[strings-02-two-pointers-window]] |
| "anagram", "count chars", "group by letters" | frequency map | [[strings-03-frequency-advanced]] |
| "palindromic substrings" | expand around center | [[strings-03-frequency-advanced]] |

## Related tracks
- Same engines as [[arrays-03-two-pointers]], [[arrays-04-sliding-window]], [[hashing-02-frequency-map]]
- Parsing/matching often needs a [[stack-00-roadmap|stack]]

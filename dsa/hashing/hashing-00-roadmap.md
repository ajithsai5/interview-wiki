---
title: Hashing 00 · Interview Roadmap
phase: 2
tags: [dsa, hashing, roadmap, index]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## Why hashing is the highest-ROI topic
Most array/string interview problems become easy the moment you recognize:
**"use a HashMap or HashSet."** A hash structure turns "have I seen this / how
many / where is its partner?" from an O(n) scan into an **O(1)** lookup — which is
how an O(n²) brute force collapses to O(n).

> The whole skill is **pattern recognition**: read the problem, spot the clue,
> reach for the right hashing pattern. The table at the bottom is your decoder.

## The path
1. [[hashing-01-fundamentals|Fundamentals]] — key→value, HashMap vs HashSet, O(1), how it works under the hood
2. [[hashing-02-frequency-map|Frequency Map]] — count occurrences → majority, top-K, group anagrams
3. [[hashing-03-set-lookup|Set Lookup]] — presence checks → duplicates, intersection, longest consecutive
4. [[hashing-04-complement-map|Complement / Index Map]] — Two Sum, first unique character
5. [[hashing-05-prefix-hashmap|Prefix Sum + HashMap]] — subarray sum = k, equal 0/1 subarrays (the big one)
6. [[hashing-06-strings-window|Hashing + Strings & Window]] — anagrams, longest substring, minimum window

## Patterns ranked by interview frequency
| Pattern | Importance | Page |
|---|---|---|
| Prefix sum + hashmap | Extremely High | [[hashing-05-prefix-hashmap]] |
| Sliding window + set | Extremely High | [[hashing-06-strings-window]] |
| Frequency counting | Very High | [[hashing-02-frequency-map]] |
| Set-based lookup | Very High | [[hashing-03-set-lookup]] |
| Complement / index map | Very High | [[hashing-04-complement-map]] |
| Hashing + sorting | High | [[hashing-02-frequency-map]] |

## Problems by level
**Beginner** — Two Sum · Contains Duplicate · Valid Anagram · Intersection of Two Arrays

**Intermediate** — Group Anagrams · Top K Frequent Elements · Longest Consecutive Sequence · Subarray Sum Equals K · Longest Substring Without Repeating Characters

**Advanced** — Minimum Window Substring · Find All Anagrams in a String · LFU Cache · Insert Delete GetRandom O(1) (Randomized Set)

## The decoder — clue in the problem → technique
| Clue in the problem | Reach for |
|---|---|
| "fast lookup / is X present?" | HashSet → [[hashing-03-set-lookup]] |
| "count / frequency / how many times" | HashMap → [[hashing-02-frequency-map]] |
| "find a pair / two numbers that…" | complement HashMap → [[hashing-04-complement-map]] |
| "duplicate / unique" | HashSet → [[hashing-03-set-lookup]] |
| "subarray / running sum equals k" | prefix sum + HashMap → [[hashing-05-prefix-hashmap]] |
| "substring / window with a constraint" | window + set/map → [[hashing-06-strings-window]] |

## Related tracks
- [[arrays-00-roadmap]] — the Arrays roadmap (hashing powers many array problems)
- Seeded deep-dives: [[hashing-00-roadmap]] · [[arrays-01-basics]]

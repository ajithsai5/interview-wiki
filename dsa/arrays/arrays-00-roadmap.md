---
title: Arrays 00 · Interview Roadmap
phase: 2
tags: [dsa, arrays, roadmap, index]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## What this is
A from-zero learning path for **array interview questions**. Work through the 13
sections in order. Each page explains the idea in plain English, shows a diagram,
walks a worked example, gives the code, and lists problems to practice.

> Rule of thumb: don't memorize solutions. Learn the **pattern**, then re-solve a
> problem from a blank screen a few days later. That second solve is the learning.

## The path
1. [[arrays-01-basics|Array Basics & Complexity]] — what an array is, indexing, the Big-O table
2. [[arrays-02-traversal|Traversal Patterns]] — forward, backward, nested, two cursors
3. [[arrays-03-two-pointers|Two Pointers]] — collapse nested loops into one pass
4. [[arrays-04-sliding-window|Sliding Window]] — subarray / substring problems
5. [[arrays-05-prefix-sum|Prefix Sum]] — instant range sums
6. [[arrays-06-kadane|Kadane's Algorithm]] — maximum subarray sum
7. [[arrays-07-sorting|Sorting + Arrays]] — built-ins, comparators, greedy setups
8. [[arrays-08-binary-search|Binary Search]] — search in O(log n), "search on the answer"
9. [[arrays-09-hashing|Hashing with Arrays]] — frequency maps, sets, O(1) lookups
10. [[arrays-10-matrix|Matrix / 2D Arrays]] — row/col/diagonal traversal, spiral, islands
11. [[arrays-11-greedy|Greedy + Arrays]] — local choices that build a global optimum
12. [[arrays-12-advanced|Advanced Patterns]] — monotonic stack, heap, difference array
13. [[arrays-13-dp|Dynamic Programming on Arrays]] — 1D DP, state transitions

## Must-know patterns (ranked by interview frequency)
| Pattern | Importance | Page |
|---|---|---|
| Traversal | Core | [[arrays-02-traversal]] |
| Two pointers | Very High | [[arrays-03-two-pointers]] |
| Sliding window | Very High | [[arrays-04-sliding-window]] |
| Binary search | Very High | [[arrays-08-binary-search]] |
| Hashing | Very High | [[arrays-09-hashing]] |
| Prefix sum | High | [[arrays-05-prefix-sum]] |
| Greedy | High | [[arrays-11-greedy]] |
| Monotonic stack | High | [[arrays-12-advanced]] |

## Recommended practice order
**Beginner** — Reverse array · Max/Min · Rotate array · Move Zeroes · Two Sum · Best Time to Buy/Sell Stock

**Intermediate** — 3Sum · Product of Array Except Self · Maximum Subarray · Merge Intervals · Spiral Matrix · Container With Most Water

**Advanced** — Trapping Rain Water · Sliding Window Maximum · Median of Two Sorted Arrays · Largest Rectangle in Histogram · First Missing Positive

## How to read a problem (pattern triggers)
- "subarray / substring / window / contiguous" → [[arrays-04-sliding-window]] or [[arrays-05-prefix-sum]]
- "sorted array" + "pair / triplet" → [[arrays-03-two-pointers]]
- "sorted" + "find / position / smallest X such that" → [[arrays-08-binary-search]]
- "seen before / count / duplicate / frequency" → [[arrays-09-hashing]]
- "maximum / minimum sum so far" → [[arrays-06-kadane]]
- "next greater / smaller element" → monotonic stack in [[arrays-12-advanced]]

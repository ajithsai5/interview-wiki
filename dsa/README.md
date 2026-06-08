# DSA — Coding Interview Roadmap

The complete data-structures & algorithms track for Phase 2 & 4. Every topic is its
own **folder = a basics→advanced track** (a `00 roadmap` hub + numbered pages), in
**learning order**. Each page has the same shape: when to reach for it → the idea →
an ASCII diagram → a code template → complexity → canonical problems → pitfalls.

> Pass signal: solve a Medium in 20–25 minutes, talking out loud. One concept lives in
> exactly one place — no duplicates.

## Learning path (study in this order)

| # | Topic | Track | Covers |
|---|-------|-------|--------|
| 1 | **Arrays** | [arrays/](arrays/arrays-00-roadmap.md) | basics, traversal, two pointers, sliding window, prefix sum, Kadane, sorting, binary search, matrix, **greedy**, **1-D DP** |
| 2 | **Hashing** | [hashing/](hashing/hashing-00-roadmap.md) | maps & sets, frequency, complement, prefix+hashmap, strings/window |
| 3 | **Strings** | [strings/](strings/strings-00-roadmap.md) | immutability, two-pointer/window, anagrams, expand-around-center |
| 4 | **Stack** | [stack/](stack/stack-00-roadmap.md) | matching, monotonic stack, RPN/histogram |
| 5 | **Linked List** | [linked-list/](linked-list/linked-list-00-roadmap.md) | dummy head, reverse, fast/slow, merge, LRU |
| 6 | **Trees** | [trees/](trees/trees-00-roadmap.md) | DFS/BFS, BST, diameter, LCA, construct, tree-DP |
| 7 | **Heap / Priority Queue** | [heap/](heap/heap-00-roadmap.md) | top-K, two-heaps median, merge-K, scheduling |
| 8 | **Backtracking** | [backtracking/](backtracking/backtracking-00-roadmap.md) | subsets, permutations, combinations, grid/N-Queens |
| 9 | **Graphs** | [graphs/](graphs/graphs-00-roadmap.md) | BFS/DFS, grids, topo sort, union-find, Dijkstra |
| 10 | **Intervals** | [intervals/](intervals/intervals-00-roadmap.md) | merge, insert, meeting rooms, non-overlapping |
| 11 | **Math & Bits** | [math-bits/](math-bits/math-00-roadmap.md) | XOR tricks, bitmasks, gcd, primes, fast power |

> **Greedy** and **Dynamic Programming** live inside the **Arrays** track
> ([arrays-11-greedy](arrays/arrays-11-greedy.md), [arrays-13-dp](arrays/arrays-13-dp.md)),
> alongside Two Pointers / Sliding Window / Binary Search — so they're not duplicated here.

## Pattern → reach-for-it cheatsheet

| Clue in the problem | Technique |
|---|---|
| "seen before / count / duplicate / pair" | hashing |
| "sorted" + "pair/triplet" | two pointers (arrays-03) |
| "subarray / substring / window" | sliding window (arrays-04) |
| "sorted" + "find / min X such that" | binary search (arrays-08) |
| "matching / nesting / next greater" | stack |
| "all combinations / permutations / subsets" | backtracking |
| "shortest path / connected / grid" | graph BFS/DFS |
| "max/min ways, overlapping subproblems" | DP (arrays-13) |
| "top K / K-th / merge K" | heap |
| "overlapping ranges / meetings" | intervals |

## How to study
1. Read the topic's `00 roadmap`, then its pages in order.
2. Solve 2 canonical problems per page.
3. A few days later, **re-solve one from a blank screen** — that's the real learning.
4. In the app, mark each page New → Learning → Reviewing → Mastered; the spaced-review
   queue brings it back before you forget.

# DSA — Coding Interview Roadmap

The complete data-structures & algorithms track for Phase 2 & 4 (online assessments
+ coding rounds). It mirrors the **NeetCode 150** topic order: learn the *pattern*,
not the problem. Each topic page has the same shape — when to reach for it, the
core idea, an ASCII diagram, a code template, complexity, canonical problems, and
pitfalls.

> Pass signal: solve a Medium in 20–25 minutes, talking out loud.

## Learning path

| # | Topic | Folder / page | Why it matters |
|---|-------|---------------|----------------|
| 1 | **Arrays & Hashing** | [arrays/](arrays/arrays-00-roadmap.md) · [hashing/](hashing/hashing-00-roadmap.md) | the foundation; most problems start here |
| 2 | **Two Pointers** | [arrays/…two-pointers](arrays/arrays-03-two-pointers.md) | collapse nested loops on sorted data |
| 3 | **Sliding Window** | [arrays/…sliding-window](arrays/arrays-04-sliding-window.md) | subarray / substring problems |
| 4 | **Stack** | [stack/](stack/stack.md) | matching, monotonic stack, "next greater" |
| 5 | **Binary Search** | [arrays/…binary-search](arrays/arrays-08-binary-search.md) | O(log n); "search on the answer" |
| 6 | **Linked List** | [linked-list/](linked-list/linked-list.md) | pointers, fast/slow, reversal |
| 7 | **Trees** | [trees/](trees/trees.md) | BFS/DFS, BST, recursion — huge in interviews |
| 8 | **Heap / Priority Queue** | [heap/](heap/heap.md) | top-K, streaming, scheduling |
| 9 | **Backtracking** | [backtracking/](backtracking/backtracking.md) | subsets, permutations, combinations |
| 10 | **Graphs** | [graphs/](graphs/graphs.md) | BFS/DFS, topo sort, union-find, Dijkstra |
| 11 | **Dynamic Programming** | [dynamic-programming/](dynamic-programming/dynamic-programming.md) | 1-D & 2-D DP, the recipe |
| 12 | **Greedy** | [greedy/](greedy/greedy.md) | local choice → global optimum |
| 13 | **Intervals** | [intervals/](intervals/intervals.md) | sort by start, merge/overlap |
| 14 | **Strings** | [strings/](strings/strings.md) | parsing, frequency, two-pointer/window |
| 15 | **Math & Bit Manipulation** | [math-bits/](math-bits/math-and-bits.md) | XOR tricks, bit masks, number theory |

## Pattern → reach-for-it cheatsheet

| Clue in the problem | Technique |
|---|---|
| "seen before / count / duplicate / pair" | hashing — [hashing/](hashing/hashing-00-roadmap.md) |
| "sorted" + "pair / triplet" | two pointers |
| "subarray / substring / window" | sliding window |
| "sorted" + "find / min X such that" | binary search |
| "matching / nesting / next greater" | stack — [stack/](stack/stack.md) |
| "all combinations / permutations / subsets" | backtracking — [backtracking/](backtracking/backtracking.md) |
| "shortest path / connected / grid" | graph BFS/DFS — [graphs/](graphs/graphs.md) |
| "max/min ways, overlapping subproblems" | DP — [dynamic-programming/](dynamic-programming/dynamic-programming.md) |
| "top K / K-th largest / merge K" | heap — [heap/](heap/heap.md) |
| "overlapping ranges / meetings" | intervals — [intervals/](intervals/intervals.md) |

## How to study
1. Read the topic page → understand the **idea + template**.
2. Solve 2 canonical problems with it.
3. A few days later, **re-solve one from a blank screen** — that's the real learning.
4. In the app, mark each page New → Learning → Reviewing → Mastered; the spaced-review
   queue brings it back before you forget.

Folders `arrays/` and `hashing/` are full multi-page tracks; the rest are one
comprehensive page each (expandable into tracks as you go deeper).

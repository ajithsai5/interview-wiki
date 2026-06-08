---
title: Backtracking 00 · Roadmap
phase: 2
tags: [dsa, backtracking, recursion, roadmap, index]
group: Backtracking
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
"Generate / find **all** …" — subsets, permutations, combinations, or "place things
under rules" (N-Queens, Sudoku, word search). You walk a decision tree:
**choose → recurse → un-choose**, pruning branches that can't work.

## The path
1. [[backtracking-01-basics]] — the universal template + subsets
2. [[backtracking-02-perms-combos]] — permutations, combinations, handling duplicates
3. [[backtracking-03-advanced]] — grid/word search, N-Queens, partitioning, pruning

## Pattern → reach-for-it
| Clue | Use |
|---|---|
| "all subsets / the power set" | include-or-skip — [[backtracking-01-basics]] |
| "all permutations / orderings" | `used[]` — [[backtracking-02-perms-combos]] |
| "all combinations summing to X" | start index / reuse — [[backtracking-02-perms-combos]] |
| "place on a grid / board under rules" | grid DFS + undo — [[backtracking-03-advanced]] |

## Related
- It's DFS on a decision tree → builds on [[trees-01-basics|tree recursion]]; grid variants border [[graphs-00-roadmap|graphs]]; optimization versions become [[arrays-13-dp|DP]]

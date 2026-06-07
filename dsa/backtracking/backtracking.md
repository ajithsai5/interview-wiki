---
title: Backtracking
phase: 2
tags: [dsa, backtracking, recursion]
group: Backtracking
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
"Generate / find **all** ..." — **subsets, permutations, combinations**, or "place
things subject to rules" (N-Queens, Sudoku, word search). You explore a decision
tree: **choose → recurse → un-choose** (backtrack), pruning branches that can't work.

```
 subsets of [1,2,3] — at each element: include or skip
                 []
        /                 \
      [1]                  []
     /    \              /    \
   [1,2]  [1]          [2]    []
   ...    ...          ...    ...
```

## The universal template
```python
def backtrack(path, choices):
    if is_complete(path):
        results.append(path[:])      # copy! path keeps mutating
        return
    for c in choices:
        if not allowed(c, path):     # prune
            continue
        path.append(c)               # choose
        backtrack(path, next_choices(c))
        path.pop()                   # un-choose (backtrack)
```

## Subsets
```python
def subsets(nums):
    res, path = [], []
    def bt(start):
        res.append(path[:])                  # every node is a subset
        for i in range(start, len(nums)):
            path.append(nums[i])
            bt(i + 1)                        # i+1: don't reuse earlier elems
            path.pop()
    bt(0)
    return res
```

## Permutations
```python
def permute(nums):
    res, path, used = [], [], [False] * len(nums)
    def bt():
        if len(path) == len(nums):
            res.append(path[:]); return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True; path.append(nums[i])
            bt()
            path.pop(); used[i] = False
    bt()
    return res
```

## Combinations / handling duplicates
- **Combinations** (choose k, order doesn't matter): pass a `start` index so you
  only go forward (like subsets but stop at size k).
- **Skip duplicates**: sort first, then `if i > start and nums[i] == nums[i-1]: continue`.
- **Reuse allowed** (Combination Sum): recurse with `i` instead of `i+1`.

## Complexity
Exponential by nature — you're enumerating an output that's exponentially large:
- Subsets: **O(n · 2ⁿ)** · Permutations: **O(n · n!)** · Combinations: O(k · C(n,k)).
- Pruning (cutting impossible branches early) is what makes hard cases tractable.

## Canonical problems (NeetCode)
| Problem | Twist |
|---|---|
| Subsets / Subsets II | include-or-skip; II = skip dups |
| Permutations / Permutations II | `used[]`; II = skip dups |
| Combination Sum / II | reuse (`i`) vs no-reuse (`i+1`) |
| Word Search | DFS on a grid, mark visited, un-mark |
| Palindrome Partitioning | cut points + palindrome check |
| N-Queens | place per row, track cols/diagonals |
| Letter Combinations of a Phone Number | map digit→letters, branch |

## Gotchas / re-solve notes
- **Append a *copy*** (`path[:]`), not `path` — the list keeps mutating.
- Every `choose` needs a matching `un-choose` (`pop`), or state leaks across branches.
- **Sort before** dedup logic; the `i > start` guard skips only *sibling* duplicates.
- Grid backtracking: mark a cell visited **before** recursing, restore it after.

## Related
- It's DFS on a decision tree → builds on [[trees]] recursion
- Grid backtracking borders [[graphs]] DFS; optimization variants become [[dynamic-programming]]

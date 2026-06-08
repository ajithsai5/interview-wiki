---
title: Backtracking 01 · Basics
phase: 2
tags: [dsa, backtracking, recursion, subsets]
group: Backtracking
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## The decision tree
At each step you make a choice, recurse, then **undo** it to try the next choice.
```
 subsets of [1,2,3] — include or skip each element:
                  []
         /                  \
       +1                    skip
      [1]                    []
     /    \               /     \
   +2     skip          +2      skip
  [1,2]   [1]          [2]      []
  ...
```

## The universal template
```python
def backtrack(path, choices):
    if is_complete(path):
        results.append(path[:])      # COPY — path keeps mutating
        return
    for c in choices:
        if not allowed(c, path):     # prune impossible branches
            continue
        path.append(c)               # choose
        backtrack(path, next(c))
        path.pop()                   # un-choose (the "backtrack")
```

## Subsets (the power set)
Every node in the tree is itself a valid subset. Pass a `start` index so you only go
forward (no duplicate subsets).
```python
def subsets(nums):
    res, path = [], []
    def bt(start):
        res.append(path[:])                  # record this subset
        for i in range(start, len(nums)):
            path.append(nums[i])             # choose nums[i]
            bt(i + 1)                        # i+1: only later elements
            path.pop()                       # un-choose
    bt(0)
    return res
```

## Why `path[:]` and why `pop()`
- **`path[:]`** stores a *snapshot* — `path` is one shared list that keeps changing.
- Every `append` (choose) needs a matching **`pop`** (un-choose), or state leaks into
  sibling branches.

## Complexity
Exponential by nature — you're enumerating exponentially many outputs.
- Subsets: **O(n · 2ⁿ)** (2ⁿ subsets, each up to length n to copy).

## Canonical problems
| Problem | Note |
|---|---|
| Subsets | include-or-skip via start index |
| Subsets II (with duplicates) | sort + skip-duplicate guard (next page) |
| Letter Combinations of a Phone Number | branch over each digit's letters |

## Gotchas
- **Append a copy** (`path[:]`), not `path`.
- Pair every choose with an un-choose.
- Pass `start` (not 0) to avoid re-generating the same subset in a different order.

## Next
- [[backtracking-02-perms-combos]] — permutations, combinations, duplicates

---
title: Backtracking 01 · Basics
phase: 2
tags: [dsa, backtracking, recursion, subsets]
group: Backtracking
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
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
Three things to decide for any backtracking problem:
1. **What's a complete path?** (the base case that records a result)
2. **What are the choices** at each step, and which are **allowed** (the prune)?
3. **What state** do I mutate, and therefore must **undo**?

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

## Dry run — subsets of [1,2,3]
```
 bt(0) record []        path=[]
   +1 -> bt(1) record [1]
       +2 -> bt(2) record [1,2]
           +3 -> bt(3) record [1,2,3]; pop 3
         pop 2
       +3 -> bt(3) record [1,3]; pop 3
     pop 1
   +2 -> bt(2) record [2]
       +3 -> bt(3) record [2,3]; pop 3
     pop 2
   +3 -> bt(3) record [3]; pop 3
 -> [], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]   (all 2^3 = 8)
```
Notice each `pop` exactly undoes the `append` above it, so siblings start clean.

## Why `path[:]` and why `pop()`
- **`path[:]`** stores a *snapshot* — `path` is one shared list that keeps changing. If you
  appended `path` itself, every result would point at the same (finally empty) list.
- Every `append` (choose) needs a matching **`pop`** (un-choose), or state leaks into
  sibling branches.

## Complexity
Exponential by nature — you're enumerating exponentially many outputs.
- Subsets: **O(n · 2ⁿ)** (2ⁿ subsets, each up to length n to copy).
- Letter combinations: O(4ⁿ) for n digits (some map to 4 letters).

## Canonical problems
| Problem | Approach |
|---|---|
| Subsets | include-or-skip via start index |
| Subsets II (with duplicates) | sort + skip-duplicate guard (next page) |
| Letter Combinations of a Phone Number | branch over each digit's letters |
| Generate Parentheses | track open/close counts, prune invalid prefixes |

## Generate Parentheses — pruning by counts
A nice "choices constrained by state" example: only add `(` if opens remain, only add `)`
if it wouldn't exceed the opens placed so far.
```python
def generate(n):
    res = []
    def bt(s, open_, close_):
        if len(s) == 2 * n: res.append(s); return
        if open_ < n:      bt(s + "(", open_ + 1, close_)
        if close_ < open_: bt(s + ")", open_, close_ + 1)   # prune: never more ) than (
    bt("", 0, 0)
    return res
```

## Variations & follow-ups
- "Letter Combinations" → map each digit to its letters, branch over them per position.
- "Subsets with a target size" → only record when `len(path) == k`.
- Anything asking for **all** arrangements/selections is backtracking; "how many" or "the
  best one" is usually [[arrays-13-dp|DP]] instead.

## Gotchas
- **Append a copy** (`path[:]`), not `path`.
- Pair every choose with an un-choose.
- Pass `start` (not 0) to avoid re-generating the same subset in a different order.

## Next
- [[backtracking-02-perms-combos]] — permutations, combinations, duplicates

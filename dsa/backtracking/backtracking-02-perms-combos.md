---
title: Backtracking 02 · Permutations & Combinations
phase: 2
tags: [dsa, backtracking]
group: Backtracking
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Permutations (order matters, use every element)
Track which elements are already used.
```python
def permute(nums):
    res, path, used = [], [], [False] * len(nums)
    def bt():
        if len(path) == len(nums):
            res.append(path[:]); return
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True;  path.append(nums[i])
            bt()
            path.pop();      used[i] = False         # undo BOTH
    bt()
    return res
```

## Combinations / Combination Sum (order doesn't matter)
Pass a `start` index so you only move forward — that prevents `[2,3]` and `[3,2]`
duplicates.
```python
def combine(n, k):                    # all k-size combos of 1..n
    res, path = [], []
    def bt(start):
        if len(path) == k:
            res.append(path[:]); return
        for i in range(start, n + 1):
            path.append(i)
            bt(i + 1)
            path.pop()
    bt(1)
    return res
```
**Reuse allowed** (Combination Sum): recurse with `i` instead of `i + 1`.
```python
def combination_sum(candidates, target):
    res, path = [], []
    def bt(start, remain):
        if remain == 0: res.append(path[:]); return
        if remain < 0:  return                  # prune
        for i in range(start, len(candidates)):
            path.append(candidates[i])
            bt(i, remain - candidates[i])       # i (not i+1) -> reuse same number
            path.pop()
    bt(0, target)
    return res
```

## Handling duplicates (Subsets II / Permutations II / Combination Sum II)
**Sort first**, then skip a value equal to its previous sibling at the same level.
```python
# inside the loop, after sorting nums:
if i > start and nums[i] == nums[i - 1]:
    continue            # skip duplicate siblings (keeps distinct results)
```
For Permutations II, the guard uses the `used[]` array: skip `nums[i]` if it equals
`nums[i-1]` and `nums[i-1]` is not currently used.

## Complexity
- Permutations: **O(n · n!)**. Combinations: O(k · C(n,k)). Pruning shrinks the real cost.

## Canonical problems
| Problem | Twist |
|---|---|
| Permutations / Permutations II | `used[]`; II skips dup siblings |
| Combinations | start index, fixed size k |
| Combination Sum / II | reuse (`i`) vs no-reuse (`i+1`); II skips dups |
| Subsets II | sort + skip-duplicate guard |

## Gotchas
- Permutations undo **both** `path.pop()` and `used[i] = False`.
- The dedup guard is `i > start` (skips only *sibling* duplicates, not valid reuse).
- **Sort before** any duplicate handling.

## Next
- [[backtracking-03-advanced]] — grid search, N-Queens, partitioning

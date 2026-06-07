---
title: Dynamic Programming
phase: 2
tags: [dsa, dp, memoization]
group: Dynamic Programming
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
Two signals together: **(1) overlapping subproblems** (the same smaller problem
recurs) and **(2) optimal substructure** (the answer is built from answers to
smaller versions). Phrases like *"number of ways", "min/max cost", "longest/shortest
…", "can you reach …"* over choices that interact → DP.

> Greedy fails when a locally-best choice can be wrong later. DP considers the
> options and reuses results so it doesn't re-compute. (Contrast: [[greedy]].)

## The recipe (derive any DP)
```
 1. STATE     what does dp[i] (or dp[i][j]) MEAN, in words?
 2. CHOICE    at a state, what options do I have?
 3. RECURRENCE combine smaller states for each choice; take best/sum
 4. BASE      smallest input(s)
 5. ORDER     fill so dependencies are ready (bottom-up), or memoize (top-down)
 6. OPTIMIZE  if dp[i] needs only dp[i-1], dp[i-2] -> drop to O(1) variables
```

## Top-down (memoized recursion) vs bottom-up (table)
```python
from functools import lru_cache

# Top-down: natural to write — add a cache to the recursion
def climb(n):
    @lru_cache(None)
    def ways(i):
        if i <= 2: return i
        return ways(i-1) + ways(i-2)
    return ways(n)

# Bottom-up: fill iteratively, often O(1) space
def climb_bu(n):
    a, b = 1, 2
    for _ in range(n - 1):
        a, b = b, a + b
    return a
```

## 1-D DP — House Robber
`dp[i] = best using houses up to i`; at i, **skip** (dp[i-1]) or **rob** (arr[i]+dp[i-2]).
```python
def rob(arr):
    prev2 = prev1 = 0
    for x in arr:
        prev2, prev1 = prev1, max(prev1, x + prev2)
    return prev1                      # O(n) time, O(1) space
```

## 2-D DP — grid / two sequences
State spans two axes (positions in two strings, or a grid cell). Classic shape:
```
 Longest Common Subsequence of A, B:
 dp[i][j] = LCS of A[:i], B[:j]
   if A[i-1]==B[j-1]: dp[i][j] = dp[i-1][j-1] + 1
   else:              dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```
```python
def lcs(a, b):
    dp = [[0]*(len(b)+1) for _ in range(len(a)+1)]
    for i in range(1, len(a)+1):
        for j in range(1, len(b)+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[-1][-1]
```

## Complexity
Usually **O(states × work-per-state)**. 1-D ≈ O(n); 2-D ≈ O(n·m). Memory often
reduces to one or two rows/variables once you see the dependency.

## Canonical problems (NeetCode)
| Problem | Family |
|---|---|
| Climbing Stairs · House Robber I/II | 1-D |
| Coin Change · Combination Sum IV | unbounded 1-D |
| Longest Increasing Subsequence | 1-D (or patience/binary search) |
| Maximum Product Subarray · Maximum Subarray | running 1-D ([[arrays-06-kadane]]) |
| Longest Common Subsequence · Edit Distance | 2-D, two strings |
| Unique Paths · Min Path Sum | 2-D grid |
| 0/1 Knapsack · Partition Equal Subset Sum | 2-D (capacity) |
| Longest Palindromic Substring | 2-D / expand-around-center |

## Gotchas / re-solve notes
- **Write the state meaning in one sentence first** — a vague state = wrong recurrence.
- Nail **base cases** (empty / size 0) and the **fill order** (deps before use).
- Off-by-one: a `+1` sized table (`dp[n+1]`) makes string/grid bounds cleaner.
- Start top-down with `@lru_cache` to get it correct, then convert to bottom-up if needed.

## Related
- 1-D DP on arrays is detailed in [[arrays-13-dp]]; max-subarray is [[arrays-06-kadane]]
- Decide DP vs [[greedy]] by whether a local choice can be safely committed

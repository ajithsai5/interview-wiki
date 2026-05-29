---
title: Arrays 06 · Kadane's Algorithm
phase: 2
tags: [dsa, arrays, kadane, dp]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## What it solves
**Maximum Subarray Sum**: the largest sum of any contiguous block. Kadane does it
in **one pass, O(n)** — a baby dynamic-programming idea.

## The intuition
Walk left to right keeping `current` = the best sum of a subarray **ending right
here**. At each element you face one choice:

> Should this element **join** the running subarray, or **start fresh** from here?

You start fresh whenever the running sum has gone negative — a negative prefix can
only drag down whatever comes next.

```
 current = max(arr[i], current + arr[i])
            \________/   \______________/
            start fresh   extend the run
 answer  = max(current over all i)
```

## Trace it
```
 arr =   [-2,  1, -3,  4, -1,  2,  1, -5,  4]

 i      x   current = max(x, current+x)     best
 0     -2   max(-2, ..)        = -2          -2
 1      1   max(1, -2+1=-1)    =  1           1
 2     -3   max(-3, 1-3=-2)    = -2           1
 3      4   max(4, -2+4=2)     =  4           4
 4     -1   max(-1, 4-1=3)     =  3           4
 5      2   max(2, 3+2=5)      =  5           5
 6      1   max(1, 5+1=6)      =  6           6   <- best subarray [4,-1,2,1]
 7     -5   max(-5, 6-5=1)     =  1           6
 8      4   max(4, 1+4=5)      =  5           6
                                       answer = 6
```

```python
def max_subarray(arr):
    current = best = arr[0]
    for x in arr[1:]:
        current = max(x, current + x)   # join the run, or restart at x
        best = max(best, current)
    return best
# O(n) time, O(1) space
```

> Edge case: arrays of **all negatives** (e.g. `[-3,-1,-2]`). Initializing both
> vars to `arr[0]` (not `0`) returns the least-bad single element (`-1`). Don't
> seed `best = 0`, or you'd wrongly answer 0.

## Variant — track the indices of the best subarray
```python
def max_subarray_range(arr):
    best = cur = arr[0]
    start = best_l = best_r = 0
    for i in range(1, len(arr)):
        if cur + arr[i] < arr[i]:    # restarting is better
            cur = arr[i]; start = i
        else:
            cur += arr[i]
        if cur > best:
            best, best_l, best_r = cur, start, i
    return best, best_l, best_r
```

## Variant — Maximum *Circular* Subarray
The best wrap-around subarray = `total - (minimum subarray)`. Answer is
`max(normal Kadane max, total - Kadane min)`. Special-case all-negative arrays
(where `total - min` would be 0 from an empty pick): just return the normal max.

```python
def max_circular(arr):
    total = 0
    cur_max = best_max = arr[0]
    cur_min = best_min = arr[0]
    for i, x in enumerate(arr):
        total += x
        if i:
            cur_max = max(x, cur_max + x); best_max = max(best_max, cur_max)
            cur_min = min(x, cur_min + x); best_min = min(best_min, cur_min)
    if best_max < 0:                 # all negative
        return best_max
    return max(best_max, total - best_min)
```

## Practice
| Problem | Note |
|---|---|
| Maximum Subarray (LC 53) | plain Kadane |
| Maximum Sum Circular Subarray (LC 918) | total − min-subarray |
| Maximum Product Subarray | track max **and** min (see [[arrays-13-dp]]) |
| Best Time to Buy/Sell Stock | Kadane on day-to-day deltas |

> **Buy/Sell as Kadane**: max profit = max subarray sum of the daily price
> *differences*. A neat reframing worth remembering.

## Pitfalls
- Seed with `arr[0]`, iterate from index 1 — avoids the all-negative trap.
- **Product** subarray is *not* plain Kadane: a negative × negative flips to
  large positive, so you must track the running **min** too.

## Related
- It's 1D DP in disguise → [[arrays-13-dp]] · differences trick relates to [[arrays-05-prefix-sum]]
- Next: [[arrays-07-sorting]]

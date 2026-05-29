---
title: Arrays 05 · Prefix Sum
phase: 2
tags: [dsa, arrays, prefix-sum]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
Precompute a **running total** so any range sum becomes one subtraction. Build it
once in O(n); then every "sum from index l to r" query is **O(1)** instead of O(n).

```
 arr     = [ 2,  4,  1,  3,  5 ]
 prefix  = [ 2,  6,  7, 10, 15 ]      prefix[i] = arr[0] + ... + arr[i]
                 \__ 2+4 = 6
```

## The formula
With a 0-indexed `prefix` where `prefix[i] = arr[0]+...+arr[i]`:

```
 sum(l .. r) = prefix[r] - prefix[l-1]        (and prefix[-1] = 0)
```

Many people add a **leading zero** to avoid the `l-1` edge case:
```
 prefix = [0, 2, 6, 7, 10, 15]    (length n+1, prefix[0]=0)
 sum(l..r) = prefix[r+1] - prefix[l]
```

```
 sum of indices 1..3 of arr = 4+1+3 = 8
 using prefix=[2,6,7,10,15]:  prefix[3] - prefix[0] = 10 - 2 = 8  ✓
```

```python
def build_prefix(arr):
    prefix = [0] * (len(arr) + 1)
    for i, x in enumerate(arr):
        prefix[i + 1] = prefix[i] + x
    return prefix                       # use prefix[r+1]-prefix[l]
```

## The killer combo — prefix sum + hashmap
"Count/where subarrays sum to **k**." A subarray `(l..r)` sums to `k` when
`prefix[r] - prefix[l-1] = k`, i.e. `prefix[l-1] = prefix[r] - k`. So as you
sweep, ask a hashmap: *how many earlier prefixes equal `current - k`?*

```
 Subarray Sum Equals K (k = 7)
 arr     = [ 3,  4,  7, 2, -3, 1, 4, 2 ]
 running prefix = 3,7,14,...   at prefix=14, look for 14-7=7 seen before -> yes
```
```python
def subarray_sum_equals_k(arr, k):
    seen = {0: 1}              # prefix value -> how many times seen
    running = count = 0
    for x in arr:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count
# O(n) time, O(n) space — and it works with negative numbers, unlike sliding window
```

> Why not sliding window here? Sliding window needs the sum to move
> *monotonically* as the window grows. With **negative numbers** it doesn't, so
> prefix-sum + hashmap is the tool.

## Worked example — Pivot Index
Find `i` where the sum of everything left of `i` equals the sum to its right.
```
 left_sum + arr[i] + right_sum = total
 right_sum = total - left_sum - arr[i]
 pivot when left_sum == right_sum
```
```python
def pivot_index(arr):
    total = sum(arr)
    left = 0
    for i, x in enumerate(arr):
        if left == total - left - x:   # right side
            return i
        left += x
    return -1
```

## Practice
| Problem | Idea |
|---|---|
| Range Sum Query (immutable) | build prefix once, O(1) queries |
| Subarray Sum Equals K | prefix + hashmap |
| Pivot Index / Find Pivot | running left-sum |
| Continuous Subarray Sum (multiple of k) | store prefix **mod k** in hashmap |
| Product of Array Except Self | prefix product × suffix product |

**Product Except Self** (prefix/suffix without division):
```python
def product_except_self(arr):
    n = len(arr)
    res = [1] * n
    pre = 1
    for i in range(n):          # res[i] = product of everything to the left
        res[i] = pre; pre *= arr[i]
    suf = 1
    for i in range(n - 1, -1, -1):
        res[i] *= suf; suf *= arr[i]
    return res
```

## Pitfalls
- Initialize the map with `{0: 1}` — it accounts for a subarray starting at index 0.
- Watch the `l-1` boundary; the **leading-zero** prefix avoids it cleanly.
- 2D version exists (prefix sums over a matrix) for submatrix sums.

## Related
- Contrast with [[arrays-04-sliding-window]] (positives only) · uses [[arrays-09-hashing]]
- Next: [[arrays-06-kadane]] — a different "running" trick for max sum

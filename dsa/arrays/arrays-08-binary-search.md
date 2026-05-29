---
title: Arrays 08 · Binary Search
phase: 2
tags: [dsa, arrays, binary-search]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
On a **sorted** array, halve the search space every step: check the middle, then
throw away the half that can't contain the answer. **O(log n)** — 1,000,000 items
in ~20 steps.

```
 target = 7 in [1, 3, 5, 7, 9, 11, 13]
 l=0 r=6  mid=3 -> arr[3]=7 == 7  found at index 3

 target = 5:
 l=0 r=6  mid=3 (7) >5  -> search left,  r=2
 l=0 r=2  mid=1 (3) <5  -> search right, l=2
 l=2 r=2  mid=2 (5) ==5 -> found
```

## The safe template
```python
def binary_search(arr, target):
    l, r = 0, len(arr) - 1          # inclusive bounds
    while l <= r:                    # <= because l==r is a real candidate
        mid = l + (r - l) // 2       # avoids overflow; same as (l+r)//2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            l = mid + 1              # answer is to the right
        else:
            r = mid - 1              # answer is to the left
    return -1                        # not found
```

> **Why `mid = l + (r - l)//2`?** In languages with fixed-size ints, `l + r` can
> overflow. This form can't. In Python it doesn't matter, but interviewers love it.

## Lower bound vs upper bound
For duplicates and "insert position" questions, search for a **boundary**, not a
value:
- **lower_bound(x)** = first index with `arr[i] >= x`
- **upper_bound(x)** = first index with `arr[i] > x`
- count of `x` = `upper_bound(x) - lower_bound(x)`

```python
def lower_bound(arr, x):
    l, r = 0, len(arr)              # note r = len (half-open [l, r))
    while l < r:
        mid = l + (r - l) // 2
        if arr[mid] < x:
            l = mid + 1
        else:
            r = mid
    return l                         # first index where arr[i] >= x
```
(Python's `bisect.bisect_left` / `bisect_right` are these two.)

## The power move — "Binary Search on the Answer"
When the answer is a **number** and "is X feasible?" gets *easier* as X grows (a
monotonic yes/no), binary-search the answer range instead of an array.

```
 feasibility:  no no no | yes yes yes      <- find the boundary
 e.g. "minimum eating speed", "min days", "split array largest sum",
 "capacity to ship in D days"
```
```python
def min_feasible(lo, hi, feasible):
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if feasible(mid):
            hi = mid                 # mid works; try smaller
        else:
            lo = mid + 1             # mid too small; go bigger
    return lo
```

## Worked example — Search in Rotated Sorted Array
One half is always sorted. Find which half is sorted, check if the target lies in
it, and recurse into the right side.
```
 [4,5,6,7,0,1,2], target=0
 mid=3 (7). left half [4..7] is sorted. 0 not in [4,7] -> go right.
```
```python
def search_rotated(arr, target):
    l, r = 0, len(arr) - 1
    while l <= r:
        mid = l + (r - l) // 2
        if arr[mid] == target:
            return mid
        if arr[l] <= arr[mid]:                 # left half sorted
            if arr[l] <= target < arr[mid]:
                r = mid - 1
            else:
                l = mid + 1
        else:                                   # right half sorted
            if arr[mid] < target <= arr[r]:
                l = mid + 1
            else:
                r = mid - 1
    return -1
```

## Practice
| Problem | Variant |
|---|---|
| Search Insert Position | lower_bound |
| First and Last Position | lower_bound + upper_bound |
| Search in Rotated Sorted Array | sorted-half logic |
| Find Peak Element | binary search without a sorted array (compare to neighbor) |
| Median of Two Sorted Arrays | binary search on the partition (hard) |
| Koko Eating Bananas / Ship Within D Days | search on the answer |

## Pitfalls
- **Infinite loops**: pick a consistent template. With `l <= r` always do
  `mid±1`; with `l < r` half-open, move `l=mid+1` / `r=mid` (never `r=mid-1`).
- The array must be **sorted** (or monotone in the property you test).
- Returning the wrong boundary — be clear whether you want first-true or last-false.

## Related
- Needs [[arrays-07-sorting]] first · seeded deep-dive: [[binary-search]]
- Next: [[arrays-09-hashing]]

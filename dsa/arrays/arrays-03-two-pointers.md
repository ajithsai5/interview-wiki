---
title: Arrays 03 · Two Pointers
phase: 2
tags: [dsa, arrays, two-pointers]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
Use **two indices** that move through the array intelligently so you avoid a
nested loop. Instead of checking all pairs (O(n²)), you make O(n) decisions about
which pointer to move. Works best on **sorted** arrays or when you need pairs.

## Flavor A — opposite ends (converging)
Start `L` at the front, `R` at the back. Move them toward each other based on a
comparison. Great for "find a pair with property X" in a **sorted** array.

```
 Two Sum (sorted), target = 9
 +----+----+----+----+----+
 |  1 |  3 |  4 |  6 |  8 |
 +----+----+----+----+----+
   ^L                  ^R     sum=1+8=9  == target  -> found!
```
Decision rule when `sum != target`:
- `sum < target` → need bigger → `L += 1` (move left pointer up)
- `sum > target` → need smaller → `R -= 1` (move right pointer down)

```python
def two_sum_sorted(arr, target):
    l, r = 0, len(arr) - 1
    while l < r:
        s = arr[l] + arr[r]
        if s == target:
            return [l, r]
        if s < target:
            l += 1
        else:
            r -= 1
    return []
# O(n) time, O(1) space — vs O(n^2) brute force
```

## Flavor B — same direction (slow / fast, "read / write")
Both start on the left. A **fast** pointer scans; a **slow** pointer marks where
the next "kept" value goes. Perfect for in-place filtering.

```
 Move Zeroes -> push non-zeros forward, zeros to the end
 +----+----+----+----+----+
 |  0 |  1 |  0 |  3 | 12 |
 +----+----+----+----+----+
   w
   f ->            fast finds a non-zero, writes it at slow(w), w++
 result: [1, 3, 12, 0, 0]
```
```python
def move_zeroes(arr):
    w = 0                          # write index (slow)
    for f in range(len(arr)):      # fast scans
        if arr[f] != 0:
            arr[w], arr[f] = arr[f], arr[w]
            w += 1
    return arr
```

## Worked example — Container With Most Water
Each bar is a wall height; water between `L` and `R` = `min(h[L], h[R]) * (R-L)`.
Move the **shorter** wall inward (moving the taller one can only lose width with
no height gain).

```
 height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
            L                       R     area = min(1,7)*8 = 8  -> move L (shorter)
```
```python
def max_area(h):
    l, r, best = 0, len(h) - 1, 0
    while l < r:
        best = max(best, min(h[l], h[r]) * (r - l))
        if h[l] < h[r]:
            l += 1
        else:
            r -= 1
    return best
```

## When to reach for it
- Array is **sorted** (or you can sort it) and you need a pair/triplet.
- "Remove duplicates in place", "move/partition elements" → slow/fast.
- A palindrome check (compare ends moving inward).

## Practice
| Problem | Flavor |
|---|---|
| Two Sum II (sorted) | opposite ends |
| Valid Palindrome | opposite ends |
| Remove Duplicates from Sorted Array | slow/fast |
| Move Zeroes | slow/fast |
| Container With Most Water | opposite ends |
| 3Sum | sort, then fix one + two-pointer the rest |

**3Sum** = sort, then for each `i`, two-pointer the remaining subarray for
`-arr[i]`; skip duplicates to avoid repeat triplets. O(n²).

## Pitfalls
- Two pointers on **unsorted** data usually needs sorting first (costs O(n log n)).
- Remember to **skip duplicates** in 3Sum or you'll emit the same triple twice.
- Loop condition is `l < r` (not `<=`) when the two must be different elements.

## Related
- Compare with the seeded [[two-pointers]] note · brute-force baseline in [[arrays-02-traversal]]
- Next: [[arrays-04-sliding-window]] — two pointers that bound a *window*

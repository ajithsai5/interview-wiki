---
title: Arrays 04 · Sliding Window
phase: 2
tags: [dsa, arrays, sliding-window]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
A **window** is a contiguous range `[left .. right]`. Instead of recomputing a
sum/count for every possible subarray (O(n²)), you **slide** the window: add the
new element on the right, remove the old one on the left, and update your running
answer in O(1). Total work: **O(n)**.

```
 window slides right; you only add the entering item and drop the leaving item
 +----+----+----+----+----+----+
 |  2 |  1 |  5 |  1 |  3 |  2 |
 +----+----+----+----+----+----+
   [    window    ]
        [    window    ]            (left++ , right++)
```

**Trigger words**: *subarray, substring, contiguous, window, "of size k",
longest/shortest segment such that…*

## Type 1 — Fixed-size window (size k)
Maintain a running sum; when the window exceeds `k`, drop the leftmost.

**Max sum subarray of size k:**
```
 arr = [2, 1, 5, 1, 3, 2],  k = 3
 [2 1 5]=8 -> [1 5 1]=7 -> [5 1 3]=9 -> [1 3 2]=6     answer = 9
```
```python
def max_sum_k(arr, k):
    window = sum(arr[:k])
    best = window
    for r in range(k, len(arr)):
        window += arr[r] - arr[r - k]   # add entering, drop leaving
        best = max(best, window)
    return best
```

## Type 2 — Dynamic window (grow / shrink)
The window size isn't fixed: **expand** `right` to include more, and **shrink**
`left` while a constraint is violated. Classic template:

```python
def longest_valid(s):
    left = 0
    state = {}            # whatever you track (counts, sum, set...)
    best = 0
    for right in range(len(s)):
        # 1) include s[right] into state
        add(state, s[right])
        # 2) shrink from the left until the window is valid again
        while not valid(state):
            remove(state, s[left])
            left += 1
        # 3) window [left..right] is now valid -> update answer
        best = max(best, right - left + 1)
    return best
```

**Longest substring without repeating characters:**
```
 s = "a b c a b b"
      L                 expand R; when a repeat appears, move L past it
 keep window with all-unique chars; track max length (here 3: "abc")
```
```python
def length_of_longest(s):
    seen = {}           # char -> last index
    left = best = 0
    for right, c in enumerate(s):
        if c in seen and seen[c] >= left:
            left = seen[c] + 1      # jump left past the duplicate
        seen[c] = right
        best = max(best, right - left + 1)
    return best
```

## Worked example — Minimum size subarray sum ≥ target
Smallest contiguous length whose sum ≥ target. Grow right to reach the target,
then shrink left as far as possible while still ≥ target.
```python
def min_subarray_len(target, arr):
    left = s = 0
    best = float('inf')
    for right in range(len(arr)):
        s += arr[right]
        while s >= target:                 # shrink greedily
            best = min(best, right - left + 1)
            s -= arr[left]
            left += 1
    return 0 if best == float('inf') else best
```

## Practice
| Problem | Window type |
|---|---|
| Maximum sum subarray of size K | fixed |
| Longest substring without repeating chars | dynamic |
| Minimum size subarray sum | dynamic (shrink) |
| Fruits Into Baskets (≤2 distinct) | dynamic (count map) |
| Longest Repeating Character Replacement | dynamic (count + window) |

## Fixed vs dynamic — how to tell
- Problem says **"of size k"** → fixed window.
- Problem says **"longest/shortest … such that <condition>"** → dynamic window.

## Pitfalls
- Window length is `right - left + 1` (the `+1` is easy to forget).
- Update the answer at the **right moment** — for "longest", update *after* the
  window is valid; for "shortest", update *while* shrinking.
- Sliding window assumes **contiguous** ranges. Non-contiguous? It's not a window.

## Related
- Builds on [[arrays-03-two-pointers]] · negatives? often need [[arrays-05-prefix-sum]]
- Seeded deep-dive: [[sliding-window]] · windowed *max*: [[arrays-12-advanced]]

---
title: Arrays 12 · Advanced Patterns
phase: 2
tags: [dsa, arrays, monotonic-stack, heap, difference-array]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## What's here
The patterns that separate "medium" from "strong": **monotonic stack**, **heap +
arrays**, **difference array**, and the prefix/hashmap combo. Each kills an
O(n²) brute force on a specific shape of problem.

## Monotonic stack — "next greater / smaller element"
Keep a stack that stays sorted (increasing or decreasing). When a new element
breaks the order, **pop** — and each pop resolves an answer. Each element is
pushed/popped once → **O(n)**.

```
 Daily Temperatures: days until a warmer day
 temps = [73, 74, 75, 71, 69, 72, 76, 73]
 stack holds indices with no warmer day yet (decreasing temps).
 when temps[i] > temps[stack top], pop and record i - poppedIndex.
```
```python
def daily_temperatures(temps):
    res = [0] * len(temps)
    stack = []                      # indices, temps decreasing
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            res[j] = i - j          # days waited
        stack.append(i)
    return res
```

## Worked example — Trapping Rain Water
Water above a bar = `min(maxLeft, maxRight) - height`. The **two-pointer** version
is O(n) time, O(1) space: move the side with the smaller max inward.
```
        |        maxL=.. |~~~~~~~| maxR=..
   |~~~~|~~|         trapped = min(maxL,maxR) - h[i]
  _|____|__|____
 height = [0,1,0,2,1,0,1,3,2,1,2,1]   -> traps 6 units
```
```python
def trap(h):
    l, r = 0, len(h) - 1
    max_l = max_r = water = 0
    while l < r:
        if h[l] < h[r]:
            max_l = max(max_l, h[l])
            water += max_l - h[l]
            l += 1
        else:
            max_r = max(max_r, h[r])
            water += max_r - h[r]
            r -= 1
    return water
```

## Heap + arrays — "top K" / "K-th" / streaming
A heap (priority queue) keeps the largest/smallest K efficiently — push/pop in
O(log k). Use a **min-heap of size k** for "top K largest".
```python
import heapq
def k_largest(nums, k):
    return heapq.nlargest(k, nums)         # or maintain a size-k min-heap
```
**Sliding Window Maximum** uses a **monotonic deque** (indices, decreasing
values): the front is always the current window's max.
```python
from collections import deque
def max_sliding_window(nums, k):
    dq, res = deque(), []                  # dq holds indices, values decreasing
    for i, x in enumerate(nums):
        while dq and nums[dq[-1]] <= x:    # pop smaller-or-equal
            dq.pop()
        dq.append(i)
        if dq[0] <= i - k:                 # front fell out of the window
            dq.popleft()
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res
```

## Difference array — range updates in O(1)
To add `val` to every index in `[l, r]` many times, don't touch each cell. Mark
`diff[l] += val` and `diff[r+1] -= val`; a final prefix sum reconstructs the array.
```
 add +3 to [1..3]:  diff[1]+=3, diff[4]-=3
 diff:  [0, 3, 0, 0, -3]
 prefix-sum -> [0, 3, 3, 3, 0]     (each of indices 1..3 got +3)
```
```python
def range_updates(n, updates):             # updates = [(l, r, val), ...]
    diff = [0] * (n + 1)
    for l, r, val in updates:
        diff[l] += val
        diff[r + 1] -= val
    out, run = [], 0
    for i in range(n):
        run += diff[i]
        out.append(run)
    return out
```

## Largest Rectangle in Histogram (monotonic stack)
Maintain a stack of increasing bar heights; when a shorter bar appears, pop and
compute the area each popped bar can span. O(n).

## Practice
| Problem | Pattern |
|---|---|
| Daily Temperatures | monotonic stack |
| Trapping Rain Water | two pointers / stack |
| Largest Rectangle in Histogram | monotonic stack |
| Sliding Window Maximum | monotonic deque |
| Top K Frequent / K-th Largest | heap |

## Pitfalls
- Monotonic stack: be clear whether it's **increasing or decreasing**, and store
  **indices** (you usually need distances).
- Sliding-window-max deque: pop from the **front** when it leaves the window.
- Difference array needs the `n+1` slot for the `r+1` decrement.

## Related
- Builds on [[arrays-04-sliding-window]], [[arrays-05-prefix-sum]] · heap basics: seeded [[heaps]]
- Next: [[arrays-13-dp]]

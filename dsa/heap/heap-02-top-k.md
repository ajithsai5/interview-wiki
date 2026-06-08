---
title: Heap 02 · Top-K Pattern
phase: 2
tags: [dsa, heap, top-k]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## The size-K heap (the counter-intuitive trick)
For **K largest**, keep a **min-heap of size K**. The smallest of your K best sits at
the root, so a new element only earns a spot if it beats that root. You hold just K
items → **O(n log k)** time, **O(k)** space.
```
 K=3, stream 5,1,7,3,9 :
 heap keeps the 3 largest seen; root = smallest of the 3
 -> after all: {7,9,5}  (root 5)   -> answers 9,7,5
```
```python
import heapq
def k_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)     # evict the smallest -> keep the top K
    return h                     # the k largest (unordered)
```
(Symmetric: for **K smallest**, keep a **max-heap** of size K via negation.)

## K-th largest
The root of a size-K min-heap is exactly the K-th largest.
```python
def kth_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k: heapq.heappop(h)
    return h[0]                   # K-th largest
# or simply: heapq.nlargest(k, nums)[-1]
```

## K closest points to origin
Same pattern, keyed by distance (no need for the real sqrt — compare squared dist).
```python
def k_closest(points, k):
    return heapq.nsmallest(k, points, key=lambda p: p[0]**2 + p[1]**2)
```

## Top K frequent — count, then heap
```python
from collections import Counter
def top_k_frequent(nums, k):
    freq = Counter(nums)
    return heapq.nlargest(k, freq.keys(), key=freq.get)
```

## Heap vs Quickselect
- **Heap**: O(n log k), simple, great for **streaming** (data arrives over time).
- **Quickselect**: O(n) average to find the K-th, but needs the full array in memory and
  has O(n²) worst case. Use heap when in doubt or when data streams.

## Canonical problems
| Problem | Heap |
|---|---|
| Kth Largest Element in an Array | size-K min-heap |
| K Closest Points to Origin | size-K max-heap by distance |
| Top K Frequent Elements | count + nlargest (or bucket sort) |
| Kth Largest in a Stream | persistent size-K heap |

## Gotchas
- **K largest → min-heap of size K** (and K smallest → max-heap). Easy to flip by mistake.
- For distances, compare **squared** values — skip the sqrt.
- "Top K frequent" can also be **bucket sort** in O(n); heap is O(n log k).

## Next
- [[heap-03-advanced]] — two heaps, merge-K, scheduling

---
title: Heap 02 · Top-K Pattern
phase: 2
tags: [dsa, heap, top-k]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## The size-K heap (the counter-intuitive trick)
For **K largest**, keep a **min-heap of size K**. The smallest of your K best sits at
the root, so a new element only earns a spot if it beats that root. You hold just K
items → **O(n log k)** time, **O(k)** space.
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

## Dry run — K=3 over the stream 5, 1, 7, 3, 9
```
 x=5: push -> [5]
 x=1: push -> [1,5]
 x=7: push -> [1,5,7]                 size 3, ok
 x=3: push -> [1,3,7,5]; size 4 -> pop min 1 -> [3,5,7]   (3 kicked 1's slot? no—evicts 1)
 x=9: push -> [3,5,7,9]; size 4 -> pop min 3 -> [5,7,9]
 result: {5,7,9} = the three largest. root 5 = the 3rd largest.
```
Each element pays at most O(log k); the heap never grows past K.

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
- **Heap**: O(n log k), simple, great for **streaming** (data arrives over time) and when
  k ≪ n.
- **Quickselect**: O(n) average to find the K-th, but needs the full array in memory and
  has O(n²) worst case. Use heap when in doubt or when data streams.
- **Bucket sort**: when values are counts bounded by n (e.g. "top K frequent"), bucket by
  frequency for **O(n)** with no heap at all.

## Canonical problems
| Problem | Approach |
|---|---|
| Kth Largest Element in an Array | size-K min-heap (or quickselect) |
| K Closest Points to Origin | size-K max-heap by squared distance |
| Top K Frequent Elements | Counter + nlargest, or O(n) bucket sort |
| Kth Largest in a Stream | persistent size-K min-heap, peek root |
| Sort Characters by Frequency | Counter + max-heap (or bucket) |

## Variations & follow-ups
- "Kth Largest in a **Stream**" (design a class) → keep the size-K heap as state; each
  `add` is O(log k) and returns `h[0]`.
- "K most frequent **words**" with ties broken alphabetically → push `(count, word)` with
  a custom comparison so equal counts order by word.
- If k is close to n, just **sort** — the size-K heap's advantage is when k ≪ n.

## Gotchas
- **K largest → min-heap of size K** (and K smallest → max-heap). Easy to flip by mistake.
- For distances, compare **squared** values — skip the sqrt.
- "Top K frequent" can also be **bucket sort** in O(n); heap is O(n log k).

## Next
- [[heap-03-advanced]] — two heaps, merge-K, scheduling

---
title: Heap 01 · Basics
phase: 2
tags: [dsa, heap, priority-queue, basics]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## The heap property
A binary heap is a tree where each parent is ≤ its children (**min-heap**) or ≥
(**max-heap**). The root is therefore the min (or max), readable in **O(1)**. It's
stored as a plain array — no node objects needed.
```
 min-heap (parent <= children); heap[0] is the minimum:
          1
        /   \
       3     2
      / \
     5   4
```

## Python's `heapq` (min-heap on a list)
```python
import heapq
h = []
heapq.heappush(h, 5)        # O(log n)
heapq.heappush(h, 1)
heapq.heappush(h, 3)
h[0]                        # peek min -> 1, O(1)
heapq.heappop(h)            # remove+return min -> 1, O(log n)
heapq.heapify(nums)         # turn a list into a heap IN PLACE, O(n)
heapq.nlargest(k, nums)     # / heapq.nsmallest(k, nums)
```

## Max-heap trick — push negatives
`heapq` is min-only. For a max-heap, store `-x` and negate on the way out.
```python
h = []
for x in nums:
    heapq.heappush(h, -x)   # max-heap via negation
biggest = -heapq.heappop(h)
```

## Priority with a payload — push tuples
Tuples compare by the first element. Add a tie-breaker (e.g., an index) so Python
never tries to compare the un-comparable payload object.
```python
heapq.heappush(h, (priority, idx, item))
```

## Complexity
| Op | Cost |
|---|---|
| peek min/max | O(1) |
| push / pop | O(log n) |
| heapify (build from list) | O(n) |
| nlargest/nsmallest(k) | O(n log k) |

## Gotchas
- `heapq` is **min-heap only** — negate for max-heap.
- You can peek `h[0]` but **never index elsewhere** expecting sorted order — a heap is
  only partially ordered.
- Add a tie-breaker in tuples to avoid "TypeError: not supported between instances".

## Next
- [[heap-02-top-k]] — the size-K heap pattern

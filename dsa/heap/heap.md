---
title: Heap / Priority Queue
phase: 2
tags: [dsa, heap, priority-queue]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
A **heap** (priority queue) always gives you the **smallest (or largest) item in
O(1)**, with O(log n) insert/remove. Reach for it when you need:
- **Top-K / K-th largest / smallest**
- **Merge K sorted** things
- A value that changes as a stream arrives ("median so far", "next task")
- "Repeatedly take the best remaining option"

Python's `heapq` is a **min-heap** on a plain list. For a max-heap, push negatives.

```
 min-heap (parent <= children) — root is the minimum:
          1
        /   \
       3     2
      / \
     5   4      heap[0] == 1 == min
```

## Core operations
```python
import heapq
h = []
heapq.heappush(h, 5)      # O(log n)
heapq.heappush(h, 1)
heapq.heappush(h, 3)
heapq.heappop(h)          # -> 1 (the min), O(log n)
h[0]                      # peek min, O(1)
heapq.heapify(nums)       # build a heap in O(n)
heapq.nlargest(k, nums)   # / nsmallest
```
**Max-heap trick:** push `-x`, pop and negate. **Pair priority:** push tuples
`(priority, item)` — they compare by the first element.

## The "top-K with a size-K heap" pattern
For **K largest**, keep a **min-heap of size K**: the smallest of your K best sits
at the root, so a new item only enters if it beats it. O(n log k), O(k) space.
```python
def k_largest(nums, k):
    h = []
    for x in nums:
        heapq.heappush(h, x)
        if len(h) > k:
            heapq.heappop(h)     # drop the smallest -> keep top K
    return h                     # the k largest (unordered)
```

## Worked example — K-th largest, and Merge K lists
```python
def kth_largest(nums, k):
    return heapq.nlargest(k, nums)[-1]

# Merge K sorted lists: heap of (value, list_index, node)
def merge_k(lists):
    import heapq
    h = [(l.val, i, l) for i, l in enumerate(lists) if l]
    heapq.heapify(h)
    dummy = tail = ListNode()
    while h:
        val, i, node = heapq.heappop(h)
        tail.next = node; tail = node
        if node.next:
            heapq.heappush(h, (node.next.val, i, node.next))
    return dummy.next
```

## Complexity
| Op | Cost |
|---|---|
| peek min | O(1) |
| push / pop | O(log n) |
| heapify (build) | O(n) |
| top-K via size-K heap | O(n log k) |

## Canonical problems (NeetCode)
| Problem | Idea |
|---|---|
| Kth Largest Element in an Array | size-K min-heap (or quickselect) |
| K Closest Points to Origin | size-K heap by distance |
| Top K Frequent Elements | count then heap / bucket sort |
| Task Scheduler | max-heap of counts |
| Find Median from Data Stream | two heaps (max-heap low half, min-heap high half) |
| Merge K Sorted Lists | heap of list heads |

## Gotchas / re-solve notes
- `heapq` is **min-only** — negate for max-heap.
- For "top K largest" use a **min-heap of size K** (counter-intuitive but correct).
- Put a tie-breaker in the tuple (e.g., an index) so Python never compares the
  un-comparable payload object.
- "Median of a stream" = balance **two heaps**; keep their sizes within 1.

## Related
- Often follows [[hashing-02-frequency-map|frequency counting]] (Top-K)
- Merge-K builds on [[linked-list]]; alternative to a size-K heap is quickselect ([[arrays-07-sorting]])

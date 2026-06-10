---
title: Heap 01 · Basics
phase: 2
tags: [dsa, heap, priority-queue, basics]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
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

## Array layout — the index arithmetic
A heap is a **complete** tree (filled left-to-right), so it packs perfectly into an
array. For the node at index `i`:
```
 parent(i) = (i - 1) // 2      left(i) = 2*i + 1      right(i) = 2*i + 2

 array:   [1, 3, 2, 5, 4]
 index:    0  1  2  3  4
 node 1 (i=0): children at 1,2 -> 3,2   ✓ both >= 1
 node 3 (i=1): children at 3,4 -> 5,4   ✓ both >= 3
```
No pointers — "go to my child" is just arithmetic.

## How push/pop keep order: sift-up / sift-down
- **push**: append at the end, then **sift up** — swap with the parent while smaller.
- **pop**: take `heap[0]`, move the last element to the root, then **sift down** — swap
  with the smaller child while larger. Both touch one root-to-leaf path → **O(log n)**.
```
 push(0) into [1,3,2,5,4]:
   append -> [1,3,2,5,4,0]; 0 < parent 2 -> swap -> [1,3,0,5,4,2]
   0 < parent 1 -> swap -> [0,3,1,5,4,2]   now 0 is the root ✓
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

## Why heapify is O(n), not O(n log n)
Building bottom-up, most nodes are near the leaves and sift down only a little. The
sum `Σ (nodes at height h) · h` converges to **O(n)** — cheaper than n separate pushes.

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

## Heap vs sorted structures
| Need | Use |
|---|---|
| repeated "give me the min/max" | **heap** — O(log n) push/pop |
| full sorted order | **sort** — O(n log n) once |
| min/max **and** ordered iteration / range queries | balanced BST / sorted list |
| just the single min or max once | **linear scan** — O(n), no heap needed |

## Variations & follow-ups
- A **d-ary heap** (more children per node) lowers tree height — used when pushes vastly
  outnumber pops.
- "Decrease-key" (lower a stored priority) underlies Dijkstra; `heapq` lacks it, so the
  common workaround is **lazy deletion** — push the new value and skip stale pops.
- `heapq.merge(*iterables)` lazily merges sorted inputs without building a big list.

## Gotchas
- `heapq` is **min-heap only** — negate for max-heap.
- You can peek `h[0]` but **never index elsewhere** expecting sorted order — a heap is
  only partially ordered.
- Add a tie-breaker in tuples to avoid "TypeError: not supported between instances".

## Next
- [[heap-02-top-k]] — the size-K heap pattern

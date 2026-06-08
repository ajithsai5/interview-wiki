---
title: Heap 03 · Advanced
phase: 2
tags: [dsa, heap, two-heaps]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Two heaps — median from a data stream
Keep the lower half in a **max-heap** and the upper half in a **min-heap**, balanced so
their sizes differ by ≤ 1. The median is then the top(s) — all in O(log n) per add.
```
   max-heap (low)        min-heap (high)
        [.. 1 2 3]   |   [4 5 6 ..]
            top=3        top=4
   median = top of the bigger heap, or their average
```
```python
import heapq
class MedianFinder:
    def __init__(self):
        self.lo = []   # max-heap (store negatives)
        self.hi = []   # min-heap
    def addNum(self, x):
        heapq.heappush(self.lo, -x)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))   # move max of lo to hi
        if len(self.hi) > len(self.lo):                    # rebalance
            heapq.heappush(self.lo, -heapq.heappop(self.hi))
    def findMedian(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2
```

## Merge K sorted lists/arrays
Push one item from each source; pop the smallest, push that source's next item.
**O(N log k)** where N = total items, k = sources.
```python
def merge_k_arrays(arrays):
    h = [(a[0], i, 0) for i, a in enumerate(arrays) if a]
    heapq.heapify(h)
    out = []
    while h:
        val, i, j = heapq.heappop(h)
        out.append(val)
        if j + 1 < len(arrays[i]):
            heapq.heappush(h, (arrays[i][j+1], i, j+1))
    return out
```
(For linked lists, same idea — see [[linked-list-03-advanced]].)

## Scheduling — "always take the best next"
**Task Scheduler**, **Reorganize String**, **Meeting Rooms II** all repeatedly pop the
most-frequent / earliest-ending item from a heap.
```python
# Meeting Rooms II — min rooms = peak overlap, via a heap of end times
def min_meeting_rooms(intervals):
    intervals.sort(key=lambda iv: iv[0])
    ends = []                       # min-heap of end times
    for s, e in intervals:
        if ends and ends[0] <= s:   # a room freed up
            heapq.heappop(ends)
        heapq.heappush(ends, e)
    return len(ends)
```

## Complexity
Two-heaps add/median: O(log n)/O(1). Merge-K: O(N log k). Scheduling: O(n log n).

## Canonical problems
| Problem | Pattern |
|---|---|
| Find Median from Data Stream | two heaps |
| Merge K Sorted Lists/Arrays | heap of heads |
| Task Scheduler · Reorganize String | max-heap of counts |
| Meeting Rooms II | min-heap of end times ([[intervals-00-roadmap]]) |
| Sliding Window Median | two heaps + lazy deletion |

## Gotchas
- Two heaps: **rebalance after every add** so sizes differ by ≤ 1.
- Always include a tie-breaker index in tuples to avoid comparing payloads.
- Meeting Rooms II via heap = peak concurrency; equivalent to the start/end sweep.

## Related
- Uses [[intervals-00-roadmap]] (rooms), [[linked-list-03-advanced]] (merge-K)
- Back to [[heap-00-roadmap]]

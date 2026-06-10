---
title: Heap 03 · Advanced
phase: 2
tags: [dsa, heap, two-heaps]
group: Heap
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
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

## Dry run — add 1, 2, 3 then read the median
```
 add 1: push to lo -> lo=[-1]; move max to hi -> lo=[], hi=[1]; hi bigger -> rebalance -> lo=[-1], hi=[]
        median = -lo[0] = 1
 add 2: push 2 to lo -> lo=[-2,-1]; move max(2) to hi -> lo=[-1], hi=[2]
        sizes equal -> median = (1 + 2)/2 = 1.5
 add 3: push 3 to lo -> lo=[-3,-1]; move max(3) to hi -> lo=[-1], hi=[2,3]; hi bigger -> rebalance
        -> lo=[-2,-1], hi=[3]; lo bigger -> median = -lo[0] = 2
```
The "push to lo, shove its max into hi, rebalance" dance keeps both halves sorted-enough
in O(log n).

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

## Reorganize String — greedy with a max-heap
Repeatedly place the **most frequent remaining** character, but never the same one twice
in a row by holding the just-used one aside for one step.
```python
def reorganize(s):
    from collections import Counter
    h = [(-c, ch) for ch, c in Counter(s).items()]
    heapq.heapify(h)
    res, prev = [], None            # prev = the char we just used (on cooldown)
    while h:
        c, ch = heapq.heappop(h)
        res.append(ch)
        if prev: heapq.heappush(h, prev)   # release the cooled-down char
        prev = (c + 1, ch) if c + 1 < 0 else None
    return "".join(res) if len(res) == len(s) else ""   # "" if impossible
```

## Complexity
Two-heaps add/median: O(log n)/O(1). Merge-K: O(N log k). Scheduling: O(n log n).

## Canonical problems
| Problem | Approach |
|---|---|
| Find Median from Data Stream | two heaps, rebalance each add |
| Merge K Sorted Lists/Arrays | heap of one head per source |
| Task Scheduler | max-heap of counts + cooldown queue |
| Reorganize String | max-heap, hold the just-used char aside |
| Meeting Rooms II | min-heap of end times ([[intervals-00-roadmap]]) |
| Sliding Window Median | two heaps + lazy deletion |

## Variations & follow-ups
- "Find Median from a **fixed-size sliding window**" → two heaps plus **lazy deletion**
  (mark removed values, skip them when they surface at a root).
- "IPO / maximize capital" → two heaps: a min-heap by cost to unlock projects, a max-heap
  by profit to pick the best affordable one.
- Task Scheduler also has an **O(1) math** formula based on the most frequent task.

## Gotchas
- Two heaps: **rebalance after every add** so sizes differ by ≤ 1.
- Always include a tie-breaker index in tuples to avoid comparing payloads.
- Meeting Rooms II via heap = peak concurrency; equivalent to the start/end sweep.

## Related
- Uses [[intervals-00-roadmap]] (rooms), [[linked-list-03-advanced]] (merge-K)
- Back to [[heap-00-roadmap]]

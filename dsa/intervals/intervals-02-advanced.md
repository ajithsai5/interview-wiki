---
title: Intervals 02 · Advanced
phase: 2
tags: [dsa, intervals, greedy, heap]
group: Intervals
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Insert interval (into a sorted, non-overlapping list)
Three phases: copy all intervals **before** the new one, **merge** everything that
overlaps it, then copy the rest. No full re-sort needed → O(n).
```python
def insert(intervals, new):
    res, i, n = [], 0, len(intervals)
    while i < n and intervals[i][1] < new[0]:      # ends before new starts
        res.append(intervals[i]); i += 1
    while i < n and intervals[i][0] <= new[1]:     # overlaps -> merge
        new = [min(new[0], intervals[i][0]), max(new[1], intervals[i][1])]
        i += 1
    res.append(new)
    res.extend(intervals[i:])                      # after
    return res
```

## Dry run — insert [4,8] into [1,2] [3,5] [6,7] [9,10]
```
 phase 1 (ends before 4): [1,2] kept (2<4); [3,5] ends 5, not <4 -> stop. res: [1,2]
 phase 2 (overlaps [4,8]): [3,5] start 3<=8 -> new=[3,8]; [6,7] 6<=8 -> new=[3,8];
                           [9,10] start 9<=8? no -> stop. append new -> res: [1,2] [3,8]
 phase 3 (rest): [9,10] -> res: [1,2] [3,8] [9,10]
```
Exploiting the pre-sorted, non-overlapping input is what keeps this O(n) — no sort needed.

## Minimum meeting rooms (max concurrency)
The answer is the **peak number of overlapping meetings**. Two ways:

**Start/end sweep** — sort starts and ends; walk both with two pointers.
```python
def min_rooms(intervals):
    starts = sorted(i[0] for i in intervals)
    ends   = sorted(i[1] for i in intervals)
    rooms = best = s = e = 0
    while s < len(starts):
        if starts[s] < ends[e]:
            rooms += 1; s += 1            # a meeting starts -> need a room
            best = max(best, rooms)
        else:
            rooms -= 1; e += 1            # a meeting ends -> free a room
    return best
```
**Heap of end times** — sort by start; pop a room whose end ≤ current start, else add one.
(See [[heap-03-advanced]].)

## Dry run — min rooms for [0,30] [5,10] [15,20]
```
 starts: 0 5 15      ends: 10 20 30
 s=0 start 0 < end 10 -> rooms 1 (best 1)
 s=1 start 5 < end 10 -> rooms 2 (best 2)
 s=2 start 15 < end 10? no -> rooms 1, e=1
     start 15 < end 20 -> rooms 2 (best 2)
 -> 2 rooms. Peak overlap was the [0,30]+[5,10] window.
```

## Non-overlapping intervals (greedy, sort by END)
To keep the **most** non-overlapping intervals (or remove the fewest), greedily keep
the interval that **ends earliest** — it leaves the most room for the rest.
```python
def erase_overlap(intervals):
    intervals.sort(key=lambda iv: iv[1])     # sort by END
    kept_end = float('-inf'); removals = 0
    for s, e in intervals:
        if s >= kept_end:
            kept_end = e                     # keep it
        else:
            removals += 1                    # overlaps -> drop it
    return removals
```
Why end-sort works: the earliest-ending interval is always a **safe** keep — no other
choice leaves more room for what follows. This is the classic "activity selection" greedy
(see [[arrays-11-greedy]]).

## Complexity
Insert: O(n) (already sorted). Rooms / non-overlapping: O(n log n) from the sort.

## Canonical problems
| Problem | Approach |
|---|---|
| Insert Interval | 3-phase walk, exploit pre-sorted input |
| Meeting Rooms II (min rooms) | start/end sweep or heap of end times |
| Non-overlapping Intervals | sort by **end**, greedily keep earliest-ending |
| Minimum Arrows to Burst Balloons | sort by **end**, count disjoint groups |
| Car Pooling / My Calendar | sweep / difference array of +1/−1 events |

## Variations & follow-ups
- "Minimum Arrows to Burst Balloons" → same end-sort greedy; each new arrow is needed when
  a balloon starts after the last arrow's position.
- "Car Pooling" / "Meeting Rooms II" by **difference array**: +1 at each start, −1 at each
  end, prefix-sum to find peak load — O(n) if coordinates are small.
- "My Calendar" (booking with no double-book) → balanced BST / sorted list of intervals,
  binary-search the insertion point.

## Gotchas
- **Sort by start** to merge; **sort by end** for "max non-overlapping / min removals".
- "Min rooms" = peak overlap, not total intervals.
- Insert avoids a re-sort by exploiting the pre-sorted input.

## Related
- Greedy reasoning: [[arrays-11-greedy]]; rooms via a [[heap-03-advanced|heap]]
- Back to [[intervals-00-roadmap]]

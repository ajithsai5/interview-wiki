---
title: Intervals 02 · Advanced
phase: 2
tags: [dsa, intervals, greedy, heap]
group: Intervals
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
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

## Complexity
Insert: O(n) (already sorted). Rooms / non-overlapping: O(n log n) from the sort.

## Canonical problems
| Problem | Sort key |
|---|---|
| Insert Interval | already sorted by start |
| Meeting Rooms II (min rooms) | sweep or heap of ends |
| Non-overlapping Intervals | by **end**, greedy keep |
| Minimum Number of Arrows to Burst Balloons | by **end**, greedy |

## Gotchas
- **Sort by start** to merge; **sort by end** for "max non-overlapping / min removals".
- "Min rooms" = peak overlap, not total intervals.
- Insert avoids a re-sort by exploiting the pre-sorted input.

## Related
- Greedy reasoning: [[arrays-11-greedy]]; rooms via a [[heap-03-advanced|heap]]
- Back to [[intervals-00-roadmap]]

---
title: Intervals
phase: 2
tags: [dsa, intervals, sorting, greedy]
group: Intervals
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
Anything with **ranges `[start, end]`** that can overlap: merging bookings,
meeting-room scheduling, "can attend all meetings?", inserting a new range. The
move is almost always: **sort by start** (sometimes by end), then sweep once.

```
 intervals:    [1,3]  [2,6]      [8,10]   [15,18]
 number line:  1—3
                 2————6
                          8——10
                                  15——18
 overlap when  next.start <= current.end
```

## Merge overlapping intervals
Sort by start; extend the current interval while the next one overlaps, else start a new one.
```python
def merge(intervals):
    intervals.sort(key=lambda iv: iv[0])
    out = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:                  # overlaps the last kept
            out[-1][1] = max(out[-1][1], e)  # extend the end
        else:
            out.append([s, e])
    return out
```

## Can attend all meetings? / how many rooms?
- **Can attend all** = no overlap: sort by start, check `intervals[i].start >= intervals[i-1].end`.
- **Min meeting rooms** = max simultaneous overlap. Separate the starts and ends,
  sort each, and sweep with two pointers (or use a min-heap of end times).
```python
def min_rooms(intervals):
    starts = sorted(i[0] for i in intervals)
    ends   = sorted(i[1] for i in intervals)
    rooms = best = 0
    s = e = 0
    while s < len(starts):
        if starts[s] < ends[e]:
            rooms += 1; s += 1               # a meeting starts -> need a room
            best = max(best, rooms)
        else:
            rooms -= 1; e += 1               # a meeting ends -> free a room
    return best
```

## Insert interval (into a sorted, non-overlapping list)
Add all intervals ending before the new one, merge all that overlap, then add the rest.
```python
def insert(intervals, new):
    res, i, n = [], 0, len(intervals)
    while i < n and intervals[i][1] < new[0]:    # before, no overlap
        res.append(intervals[i]); i += 1
    while i < n and intervals[i][0] <= new[1]:   # overlapping -> merge
        new = [min(new[0], intervals[i][0]), max(new[1], intervals[i][1])]
        i += 1
    res.append(new)
    res.extend(intervals[i:])                    # after
    return res
```

## Complexity
Dominated by the **sort: O(n log n)**; the sweep is O(n). Insert into an already-sorted
list is O(n) (no sort needed).

## Canonical problems (NeetCode)
| Problem | Idea |
|---|---|
| Merge Intervals | sort by start, extend |
| Insert Interval | before / merge / after |
| Non-overlapping Intervals (min removals) | sort by **end**, greedy keep |
| Meeting Rooms | sort, check adjacent overlap |
| Meeting Rooms II (min rooms) | two-pointer sweep or min-heap of ends |

## Gotchas / re-solve notes
- Decide **sort key**: by **start** for merging; by **end** for "max non-overlapping" greedy.
- Overlap test is `a.start <= b.end` — get the `<` vs `<=` right for touching ranges.
- "Min rooms" = peak concurrency; the start/end two-pointer sweep is the clean O(n log n).

## Related
- It's [[arrays-07-sorting|sorting]] + a [[greedy]] sweep; rooms use a [[heap]]

---
title: Intervals 01 · Basics
phase: 2
tags: [dsa, intervals, sorting]
group: Intervals
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## The overlap test
Two intervals overlap when one starts before the other ends.
```
 a=[1,3]  b=[2,6]      number line:  1—3
   overlap? b.start(2) <= a.end(3)?                2————6   yes
 a=[1,3]  b=[8,10]                   1—3   ........  8——10   no (8 > 3)
```
> Rule: `a` and `b` overlap iff `a.start <= b.end` **and** `b.start <= a.end`.

## Merge overlapping intervals
**Sort by start.** Walk once; if the next interval overlaps the last kept one, extend
its end, else start a new one.
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
# [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]
```

## Can I attend all meetings? (no overlap)
Sort by start, then check each meeting begins at/after the previous one's end.
```python
def can_attend_all(intervals):
    intervals.sort(key=lambda iv: iv[0])
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:   # starts before prev ends
            return False
    return True
```

## Complexity
Dominated by the **sort: O(n log n)**; the sweep itself is O(n).

## Canonical problems
| Problem | Idea |
|---|---|
| Merge Intervals | sort by start, extend |
| Meeting Rooms (can attend all?) | sort, check adjacent overlap |
| Interval List Intersections | two-pointer over two sorted lists |

## Gotchas
- Get `<` vs `<=` right for **touching** ranges (does `[1,2]` overlap `[2,3]`?).
- Merging needs sort **by start**; "max non-overlapping" needs sort **by end** (next page).

## Next
- [[intervals-02-advanced]] — insert, min rooms, non-overlapping

---
title: Intervals 01 · Basics
phase: 2
tags: [dsa, intervals, sorting]
group: Intervals
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## The overlap test
Two intervals overlap when one starts before the other ends.
```
 a=[1,3]  b=[2,6]      number line:  1—3
   overlap? b.start(2) <= a.end(3)?                2————6   yes
 a=[1,3]  b=[8,10]                   1—3   ........  8——10   no (8 > 3)
```
> Rule: `a` and `b` overlap iff `a.start <= b.end` **and** `b.start <= a.end`.

The contrapositive is often easier to spot: they **don't** overlap iff one ends before the
other starts (`a.end < b.start` or `b.end < a.start`).

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
# [1,3],[2,6],[8,10],[15,18]  ->  [1,6],[8,10],[15,18]
```

## Dry run — merge [1,3] [2,6] [8,10] [15,18]
```
 sort by start (already): [1,3] [2,6] [8,10] [15,18]
 out: [1,3]
 [2,6]: 2 <= 3 -> overlaps -> extend end to max(3,6)=6 -> out: [1,6]
 [8,10]: 8 <= 6? no -> append -> out: [1,6] [8,10]
 [15,18]: 15 <= 10? no -> append -> out: [1,6] [8,10] [15,18]
```
The invariant: `out[-1]` is always the interval currently being grown; sorting by start
guarantees any overlapper arrives while it's still the last one kept.

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

## Why sorting is the universal first move
Almost every interval problem starts with a sort — by **start** (merge, insert, attend)
or by **end** (max non-overlapping, min arrows). Once sorted, a single linear sweep
answers the question. If you're stuck on an interval problem, "which key do I sort by?"
is usually the whole insight.

## Complexity
Dominated by the **sort: O(n log n)**; the sweep itself is O(n).

## Canonical problems
| Problem | Approach |
|---|---|
| Merge Intervals | sort by start, extend the last kept |
| Meeting Rooms (can attend all?) | sort by start, check adjacent overlap |
| Interval List Intersections | two pointers over two sorted lists |
| Summary Ranges | walk sorted nums, group consecutive |

## Variations & follow-ups
- "Interval List Intersections" → advance two pointers; the intersection of `a` and `b` is
  `[max(starts), min(ends)]` when that's valid, then drop whichever ends first.
- "Employee Free Time" → flatten all intervals, sort, merge, and the **gaps** between merged
  blocks are the free time.
- Closed vs half-open intervals changes `<` to `<=` — always pin down whether touching
  endpoints count as overlapping.

## Gotchas
- Get `<` vs `<=` right for **touching** ranges (does `[1,2]` overlap `[2,3]`?).
- Merging needs sort **by start**; "max non-overlapping" needs sort **by end** (next page).

## Next
- [[intervals-02-advanced]] — insert, min rooms, non-overlapping

---
title: Arrays 07 · Sorting + Arrays
phase: 2
tags: [dsa, arrays, sorting, greedy]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## Why sorting matters in interviews
Sorting rarely *is* the question — it's the **setup**. Once data is ordered,
duplicates sit together, binary search becomes possible, and greedy choices line
up. The reflex: *"would sorting first make this easy?"*

## Use the built-in (and know its cost)
```python
nums.sort()                       # in place, O(n log n)
ordered = sorted(nums)            # returns a new list
nums.sort(reverse=True)           # descending
```
Built-in sorts are **O(n log n)**. That's the price you pay before the easy part.

## Custom comparators / keys
Sort by a derived value with `key=`:
```python
words.sort(key=len)                         # by length
points.sort(key=lambda p: (p[0], -p[1]))    # x asc, then y desc
intervals.sort(key=lambda iv: iv[0])        # by start — the classic setup
```
For true pairwise comparison (rare in Python) use `functools.cmp_to_key`.

## The O(n log n) sorts to recognize
```
 Merge Sort  — split in half, sort each, MERGE two sorted halves.
               Stable. O(n log n) always. O(n) extra space.

   [38 27 43 3]  ->  [38 27] [43 3]  ->  [27 38] [3 43]  ->  [3 27 38 43]
                          split              sort halves        merge

 Quick Sort  — pick a pivot, partition (< pivot | pivot | > pivot), recurse.
               In place. O(n log n) average, O(n^2) worst (bad pivots).
```
The **merge** step (two-pointer merge of sorted lists) and **partition** step are
common interview sub-questions on their own.

## The O(n²) sorts (know the idea, not for real use)
| Sort | One-line idea | Time |
|---|---|---|
| Bubble | repeatedly swap adjacent out-of-order pairs; big values "bubble" up | O(n²) |
| Selection | repeatedly pick the min of the rest, place it next | O(n²) |
| Insertion | grow a sorted prefix, insert each new item into place | O(n²), great on nearly-sorted |

## Counting / bucket sort (the O(n) escape hatch)
When values live in a **small known range**, skip comparison sorting: count
occurrences and rebuild. This is how "Sort Colors" hits O(n).

## Worked example — Merge Intervals (sort + greedy)
Sort by start; sweep once, merging any interval that overlaps the last kept one.
```
 intervals = [[1,3],[2,6],[8,10],[15,18]]
 sort by start (already) ->
   [1,3] keep
   [2,6] overlaps (2 <= 3) -> merge to [1,6]
   [8,10] no overlap (8 > 6) -> push [1,6], keep [8,10]
   [15,18] no overlap -> push
 result: [[1,6],[8,10],[15,18]]
```
```python
def merge_intervals(intervals):
    intervals.sort(key=lambda iv: iv[0])
    out = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= out[-1][1]:                 # overlap
            out[-1][1] = max(out[-1][1], e) # extend the end
        else:
            out.append([s, e])
    return out
```

## Practice
| Problem | Sort sets up… |
|---|---|
| Merge Intervals | overlap detection in one sweep |
| Meeting Rooms (can attend all?) | sort by start, check adjacent overlap |
| Largest Number | custom comparator on string concatenation |
| Sort Colors | counting sort / Dutch national flag (3-way partition) |

**Largest Number** comparator: order `a,b` so that `a+b > b+a` (string compare).

## Pitfalls
- Don't forget the **O(n log n)** cost — if the rest is O(n), sorting dominates.
- `list.sort()` mutates and returns `None`; `sorted()` returns a new list.
- Sorting **loses original indices** — capture them first if you need them.

## Related
- Enables [[arrays-08-binary-search]] and [[arrays-03-two-pointers]] · feeds [[arrays-11-greedy]]
- Next: [[arrays-08-binary-search]]

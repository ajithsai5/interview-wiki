---
title: Hashing 03 · Set Lookup
phase: 2
tags: [dsa, hashing, set]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The pattern
When you only care **"is X present?"** (not how many), use a **HashSet**.
Membership is O(1) — vs O(n) for a list scan. This is the single biggest "trick":
convert a list to a set before doing lookups.

```
 if x in arr      ->  O(n)   (scans the list)      <- slow
 if x in set(arr) ->  O(1)   (one hash hop)        <- do this
```

## Use 1 — Contains Duplicate
Add as you go; a value already in the set means a duplicate.
```python
def contains_duplicate(arr):
    seen = set()
    for x in arr:
        if x in seen:
            return True
        seen.add(x)
    return False
# O(n) time, O(n) space
```

## Use 2 — Intersection of Two Arrays
Put one array in a set, then keep elements of the other that are in it.
```
 a = [1,2,2,1]  -> set {1,2}
 b = [2,2]      -> keep those in {1,2} -> {2}
```
```python
def intersection(a, b):
    sa = set(a)
    return list({x for x in b if x in sa})
```

## Use 3 — Longest Consecutive Sequence (O(n))
Put all numbers in a set. Only **start counting a run** from a number whose
predecessor is absent (a true run start). Each number is visited at most twice →
O(n), even though it looks nested.
```
 nums = {100, 4, 200, 1, 3, 2}
 1 has no 0 in set -> start run: 1,2,3,4  -> length 4
 100 has no 99     -> run length 1
 200 has no 199    -> run length 1
 answer = 4
```
```python
def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 not in s:           # x starts a run
            length = 1
            while x + length in s:
                length += 1
            best = max(best, length)
    return best
```
> Why O(n)? The inner `while` only runs for **run starts**, and across all runs it
> touches each element once. Without the `x-1 not in s` guard it would be O(n²).

## Use 4 — Happy Number (cycle detection with a set)
Track numbers you've seen; if one repeats, you're in a loop.
```python
def is_happy(n):
    seen = set()
    while n != 1 and n not in seen:
        seen.add(n)
        n = sum(int(d) ** 2 for d in str(n))
    return n == 1
```

## Practice
| Problem | Idea |
|---|---|
| Contains Duplicate | seen-set |
| Intersection of Two Arrays | set + filter |
| Longest Consecutive Sequence | set + run-start guard |
| Happy Number | set for cycle detection |
| Missing Number | set difference (or math/XOR) |

## Pitfalls
- The big win is **converting list → set** before repeated lookups.
- Longest Consecutive: forgetting the `x-1 not in s` guard makes it O(n²).
- A set drops duplicates and ordering — don't use it if you need counts (use a
  [[hashing-02-frequency-map|frequency map]]) or order.

## Related
- Builds on [[hashing-01-fundamentals]] · window+set variant: [[hashing-06-strings-window]]
- Next: [[hashing-04-complement-map]]

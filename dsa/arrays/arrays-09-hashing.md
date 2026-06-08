---
title: Arrays 09 · Hashing with Arrays
phase: 2
tags: [dsa, arrays, hashing]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The core idea
A **hash map** (dict) / **hash set** gives O(1) average lookup. Most array
questions that look O(n²) collapse to O(n) when you let a map *remember what
you've already seen*. Trade O(n) space for O(n) time.

```
 hashing turns "have I seen X?" from a scan (O(n)) into a single check (O(1))
 dict:  value -> (index | count | anything)
 set :  just membership ("is X present?")
```

## The three sub-patterns
```
 1. Seen-set        detect / dedupe / membership
 2. Complement map  pair sums: store value->index, look up target - x
 3. Frequency map   count occurrences, then reason about the counts
```

## 1. Seen-set — Contains Duplicate
```python
def contains_duplicate(arr):
    seen = set()
    for x in arr:
        if x in seen:
            return True
        seen.add(x)
    return False
```

## 2. Complement map — Two Sum (unsorted!)
No sorting needed. As you scan, ask "did I already see `target - x`?"
```
 arr = [2, 7, 11, 15], target = 9
 x=2  need 7  -> not seen, store {2:0}
 x=7  need 2  -> seen at 0  -> answer [0, 1]
```
```python
def two_sum(arr, target):
    seen = {}                      # value -> index
    for i, x in enumerate(arr):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i                # store AFTER checking (avoid self-match)
    return []
```

## 3. Frequency map — Top K Frequent
Count, then take the K biggest counts (bucket sort by frequency for O(n)).
```python
from collections import Counter
def top_k_frequent(arr, k):
    freq = Counter(arr)                       # value -> count
    return [v for v, _ in freq.most_common(k)]
```

## Worked example — Longest Consecutive Sequence (O(n))
Put everything in a set. Only start counting a run at a number whose predecessor
is **absent** (a true run start) — that keeps it O(n), not O(n·len).
```
 nums = {100, 4, 200, 1, 3, 2}
 1 has no 0 -> start: 1,2,3,4  (length 4)
 100 has no 99 -> start: 100   (length 1)
 200 has no 199 -> start: 200  (length 1)
 answer = 4
```
```python
def longest_consecutive(nums):
    s = set(nums)
    best = 0
    for x in s:
        if x - 1 not in s:           # x is the start of a run
            length = 1
            while x + length in s:
                length += 1
            best = max(best, length)
    return best
```

## Worked example — Subarray Sum Equals K
The prefix-sum + hashmap combo (full treatment in [[arrays-05-prefix-sum]]):
```python
def subarray_sum(arr, k):
    seen = {0: 1}
    running = count = 0
    for x in arr:
        running += x
        count += seen.get(running - k, 0)
        seen[running] = seen.get(running, 0) + 1
    return count
```

## Practice
| Problem | Sub-pattern |
|---|---|
| Two Sum | complement map |
| Contains Duplicate | seen-set |
| Group Anagrams | freq map keyed by sorted letters |
| Top K Frequent Elements | frequency + bucket |
| Longest Consecutive Sequence | set + run-start trick |
| Subarray Sum Equals K | prefix + hashmap |

## Pitfalls
- In Two Sum, **store after checking** or an element can pair with itself.
- Sets/dicts need **hashable** keys — convert lists to `tuple` to use as keys.
- Hash lookups are O(1) **average**; worst case O(n) under heavy collisions
  (rare in interviews, but say it if asked).

## Related
- Dedicated track: [[hashing-00-roadmap]] · seeded [[hashing-00-roadmap]] · combo with [[arrays-05-prefix-sum]]
- Next: [[arrays-10-matrix]]

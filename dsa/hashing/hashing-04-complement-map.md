---
title: Hashing 04 · Complement / Index Map
phase: 2
tags: [dsa, hashing, two-sum]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The pattern
Store `value → index` (or `value → anything`) as you scan, so that for each new
element you can instantly ask: **"have I already seen the partner I need?"** This
is the move that turns Two Sum from O(n²) into O(n).

## Two Sum — the canonical interview question
Find two numbers that add up to `target`. For each `num`, its partner is
`target - num` (its **complement**). Check the map for the complement *before*
inserting the current number.
```
 arr = [2, 7, 11, 15], target = 9
 i=0 num=2  need 9-2=7  -> not in map -> store {2:0}
 i=1 num=7  need 9-7=2  -> 2 is in map at index 0 -> answer [0, 1]
```
```python
def two_sum(arr, target):
    seen = {}                       # value -> index
    for i, num in enumerate(arr):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i               # store AFTER checking
    return []
# O(n) time, O(n) space   (brute force is O(n^2))
```

> **Why store after checking?** If you insert first, an element could match
> *itself* (e.g. target = 2*num) and return `[i, i]`.

## Use 2 — First Unique Character
Two passes with a frequency map: count, then return the first index with count 1.
```python
from collections import Counter
def first_uniq_char(s):
    freq = Counter(s)
    for i, c in enumerate(s):
        if freq[c] == 1:
            return i
    return -1
```

## Use 3 — Two Sum follow-ups
- **Return values, any order**: a set of seen values is enough.
- **Count pairs that sum to k**: map value→count; for each `num`, add
  `seen.get(k - num, 0)`, then increment `seen[num]`.
```python
def count_pairs(arr, k):
    seen = {}
    pairs = 0
    for num in arr:
        pairs += seen.get(k - num, 0)
        seen[num] = seen.get(num, 0) + 1
    return pairs
```

## Why hashing beats sorting here
The [[arrays-03-two-pointers|two-pointer]] Two Sum needs a **sorted** array
(O(n log n)) and returns *sorted-array* indices. The hashmap version is **O(n)**,
needs no sorting, and preserves original indices — usually what the problem wants.

| Approach | Time | Needs sorted? | Keeps indices? |
|---|---|---|---|
| Brute force (nested loop) | O(n²) | no | yes |
| Two pointers | O(n log n) | **yes** | no (indices shift) |
| Complement hashmap | **O(n)** | no | **yes** |

## Practice
| Problem | Idea |
|---|---|
| Two Sum | complement map |
| First Unique Character | freq map, first count==1 |
| Two Sum III / count pairs | value→count map |
| 4Sum II (count tuples) | map of pair-sums |

## Pitfalls
- Store **after** checking to avoid self-pairing.
- Map stores `value → index`; don't confuse value and index when returning.
- Duplicates: if equal values matter, store counts or lists of indices.

## Related
- Contrast with [[arrays-03-two-pointers]] · array-track version: [[arrays-09-hashing]]
- Next: [[hashing-05-prefix-hashmap]]

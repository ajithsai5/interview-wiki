---
title: Hashing 02 · Frequency Map
phase: 2
tags: [dsa, hashing, frequency]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The pattern
Count how many times each value appears, then reason about the counts. This is
the single most common hashing move.

```
 arr = [1, 1, 2, 3, 3, 3]
        \_____________/
   count each ->  { 1:2, 2:1, 3:3 }
```

```python
# the canonical one-liner
freq = {}
for x in arr:
    freq[x] = freq.get(x, 0) + 1

# or, cleaner:
from collections import Counter
freq = Counter(arr)            # Counter({3:3, 1:2, 2:1})
```

> **Common mistake**: `freq[x] = 1` overwrites the count. You must *accumulate*:
> `freq[x] = freq.get(x, 0) + 1` (or `freq[x] += 1` with a `defaultdict(int)`).

## Use 1 — Majority Element (> n/2 times)
Count, then return the key whose count exceeds `n/2`.
```python
def majority(arr):
    freq = Counter(arr)
    n = len(arr)
    for x, c in freq.items():
        if c > n // 2:
            return x
```
(Follow-up: Boyer–Moore voting does it in O(1) space — worth knowing.)

## Use 2 — Top K Frequent Elements
Count, then take the K largest counts. **Bucket sort by frequency** gives O(n)
(no need to fully sort).
```
 bucket[f] = list of values that appear f times
 walk buckets from high freq -> low, collect K
```
```python
def top_k_frequent(arr, k):
    freq = Counter(arr)
    buckets = [[] for _ in range(len(arr) + 1)]   # index = frequency
    for val, c in freq.items():
        buckets[c].append(val)
    res = []
    for c in range(len(buckets) - 1, 0, -1):
        for val in buckets[c]:
            res.append(val)
            if len(res) == k:
                return res
```

## Use 3 — Group Anagrams (hashing + sorting)
Words are anagrams iff they share the same letter multiset. Use the **sorted
letters** (or a 26-count tuple) as the map key.
```
 "eat","tea","ate"  -> key ('a','e','t')  -> same bucket
 "tan","nat"        -> key ('a','n','t')  -> another bucket
```
```python
from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        key = tuple(sorted(w))          # or a 26-length count tuple
        groups[key].append(w)
    return list(groups.values())
```

## Use 4 — Valid Anagram
Two strings are anagrams iff their frequency maps are equal.
```python
def is_anagram(a, b):
    return Counter(a) == Counter(b)     # O(n)
```

## Practice
| Problem | Idea |
|---|---|
| Valid Anagram | compare two frequency maps |
| Majority Element | count > n/2 |
| Top K Frequent Elements | count + bucket sort |
| Group Anagrams | map keyed by sorted letters |
| Sort Characters by Frequency | count, then order by count |

## Pitfalls
- Accumulate counts (`+= 1`), don't overwrite.
- `Counter` is your friend: `.most_common(k)`, equality compare, arithmetic.
- For Group Anagrams, the **key** must be hashable → use a `tuple`, not a list.

## Related
- Builds on [[hashing-01-fundamentals]] · array-track version: [[arrays-09-hashing]]
- Next: [[hashing-03-set-lookup]]

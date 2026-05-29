---
title: Arrays & Hashing
phase: 2
tags: [dsa, pattern]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

# Arrays & Hashing

## When to reach for it
Trigger signals in the problem statement:
- "Have you seen this value before?" / "count occurrences" / "find duplicates"
- "Two things that sum / pair to X" → store complements in a hash map
- "Group / bucket items by some key" (anagrams, by frequency, by remainder)
- Need O(1) membership tests instead of scanning → use a `set`
- "Subarray sum equals K" → prefix sum + hash map

The instinct: a nested loop is O(n²). A hash map usually trades O(n) space to
collapse it to O(n) time.

## The idea
A hash map / set gives you O(1) average lookup. Most "arrays & hashing" problems
are "I'm scanning the array once, and at each element I want to instantly ask a
question about what I've already seen." The map *is* the memory of the past.

Three sub-patterns:
1. **Seen-set** — dedupe / detect / membership.
2. **Complement map** — for pair-sum style (Two Sum): store `value → index`, look
   up `target - x`.
3. **Frequency / bucket map** — count, then reason about the counts (top-k,
   group anagrams, majority element).

## Template
```python
# Complement map (Two Sum)
def two_sum(nums, target):
    seen = {}                      # value -> index
    for i, x in enumerate(nums):
        if target - x in seen:
            return [seen[target - x], i]
        seen[x] = i
    return []

# Frequency map
from collections import Counter, defaultdict
freq = Counter(nums)

# Group anagrams: key by sorted letters (or by char-count tuple)
groups = defaultdict(list)
for s in strs:
    groups[tuple(sorted(s))].append(s)
```

## Complexity
- Time: O(n) for a single pass (vs O(n²) brute force).
- Space: O(n) for the map/set. The classic time-for-space trade.

## Canonical problems (NeetCode 150)
- Contains Duplicate — seen-set
- Two Sum — complement map
- Group Anagrams — bucket map
- Top K Frequent Elements — frequency map + bucket sort
- Valid Anagram — frequency compare
- Product of Array Except Self — prefix/suffix products (no division)
- Longest Consecutive Sequence — set, expand only from sequence starts

_(Create `dsa/problems/<slug>.md` per problem and link it back here, e.g. [[two-sum]].)_

## Gotchas / re-solve notes
- Insert into the complement map **after** checking, or you may match an element
  with itself.
- `Counter` comparison (`Counter(a) == Counter(b)`) is a clean Valid Anagram.
- Longest Consecutive: only start counting a run when `x-1` is NOT in the set —
  that's what keeps it O(n) instead of O(n·len).

## Related
- [[two-pointers]] — the *sorted-array* alternative to a hash map for pair sums
- [[sliding-window]] — builds on a running hash map of the current window

---
title: Hashing 05 · Prefix Sum + HashMap
phase: 2
tags: [dsa, hashing, prefix-sum]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## Why this one is *extremely* important
Almost every "count/length of subarrays whose sum/property equals X" problem is
this pattern. It also **handles negative numbers**, where a [[arrays-04-sliding-window|sliding window]]
fails. If you master one hashing pattern, make it this one.

## The idea
Let `prefix` = running sum so far. The sum of a subarray `(l..r)` is
`prefix[r] - prefix[l-1]`. So a subarray ending at `r` sums to `k` exactly when:

```
 prefix[r] - prefix[l-1] = k
 => prefix[l-1] = prefix[r] - k
```

So as you sweep and track the running prefix, ask a map: **"how many earlier
prefixes equal `prefix - k`?"** Each one marks a valid subarray ending here.

## Subarray Sum Equals K
```
 nums = [1, 2, 3], k = 3
 prefix flow:  start map {0:1}
 num=1 prefix=1  look for 1-3=-2 -> 0    store {0:1, 1:1}
 num=2 prefix=3  look for 3-3=0  -> 1 !  count=1   ([1,2])   store ...{3:1}
 num=3 prefix=6  look for 6-3=3  -> 1 !  count=2   ([3])
 answer = 2
```
```python
def subarray_sum(nums, k):
    seen = {0: 1}                  # prefix value -> how many times seen
    prefix = count = 0
    for num in nums:
        prefix += num
        count += seen.get(prefix - k, 0)
        seen[prefix] = seen.get(prefix, 0) + 1
    return count
# O(n) time, O(n) space
```

> **Why seed `{0: 1}`?** It represents the empty prefix (sum 0 before any
> element), so subarrays that start at index 0 are counted. Forgetting it is the
> classic off-by-one bug here.

## Variant — Contiguous Array (equal # of 0s and 1s)
Treat `0` as `-1`. Then "equal 0s and 1s" becomes "subarray sums to **0**". Store
the **first index** each prefix value appears; the longest subarray between two
equal prefixes wins.
```python
def find_max_length(nums):
    first = {0: -1}                # prefix -> earliest index
    prefix = best = 0
    for i, x in enumerate(nums):
        prefix += 1 if x == 1 else -1
        if prefix in first:
            best = max(best, i - first[prefix])
        else:
            first[prefix] = i
    return best
```
> Note the difference: for **counting** subarrays you store *counts*; for the
> **longest** subarray you store the *earliest index* of each prefix.

## Variant — Continuous Subarray Sum (multiple of k)
Two prefixes with the **same remainder mod k** bound a subarray whose sum is a
multiple of k. Store `prefix % k → earliest index`.
```python
def check_subarray_sum(nums, k):
    first = {0: -1}
    prefix = 0
    for i, x in enumerate(nums):
        prefix = (prefix + x) % k
        if prefix in first:
            if i - first[prefix] >= 2:    # length >= 2
                return True
        else:
            first[prefix] = i
    return False
```

## Practice
| Problem | What to store |
|---|---|
| Subarray Sum Equals K | prefix → **count** |
| Contiguous Array (0/1) | prefix(0→-1) → **earliest index** |
| Continuous Subarray Sum | prefix **% k** → earliest index |
| Subarray Sums Divisible by K | prefix % k → count |

## Count vs index — the key decision
- **"How many subarrays…"** → store prefix → **count**, seed `{0: 1}`.
- **"Longest/shortest subarray…"** → store prefix → **earliest index**, seed `{0: -1}`.

## Pitfalls
- Seed the map correctly (`{0:1}` for counting, `{0:-1}` for longest).
- Negative numbers? This is the tool — sliding window won't work.
- For mod problems, normalize negatives: `prefix % k` in Python is already
  non-negative, but in some languages add `k` then `% k`.

## Related
- Array-track version: [[arrays-05-prefix-sum]] · uses [[hashing-01-fundamentals]]
- Next: [[hashing-06-strings-window]]

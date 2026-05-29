---
title: Hashing 06 · Hashing + Strings & Window
phase: 2
tags: [dsa, hashing, strings, sliding-window]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## The combo
Strings are just arrays of characters, so hashing shines on them — and it pairs
naturally with a **[[arrays-04-sliding-window|sliding window]]**: a hash map/set
tracks what's *inside the current window* while the window slides in O(1) per step.

## Longest Substring Without Repeating Characters
Grow the window to the right; when a character repeats, jump the left edge past
its previous position. A map `char → last index` makes the jump O(1).
```
 s = "a b c a b b"
      L  (window of unique chars)
 see 'a' again at index 3 -> move L to (prev index of a)+1
 track the max window length (here 3: "abc")
```
```python
def length_of_longest(s):
    last = {}                 # char -> last seen index
    left = best = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1        # shrink past the duplicate
        last[c] = right
        best = max(best, right - left + 1)
    return best
# O(n) time, O(min(n, alphabet)) space
```

## Find All Anagrams in a String
Slide a fixed window of size `len(p)`; compare the window's frequency map to
`p`'s. Update counts in O(1) as the window moves.
```python
from collections import Counter
def find_anagrams(s, p):
    if len(p) > len(s): return []
    need = Counter(p)
    window = Counter(s[:len(p)])
    res = []
    for i in range(len(p), len(s) + 1):
        if window == need:
            res.append(i - len(p))
        if i < len(s):
            window[s[i]] += 1                 # add entering char
            left = s[i - len(p)]
            window[left] -= 1                 # drop leaving char
            if window[left] == 0:
                del window[left]              # keep maps comparable
    return res
```
> Delete zero-count keys so `window == need` compares cleanly.

## Minimum Window Substring (the hard one)
Smallest window of `s` containing all of `t`'s characters (with multiplicity).
Expand right until the window is valid, then shrink left while it stays valid,
tracking the smallest.
```
 need = counts of t;  have = how many required chars are currently satisfied
 expand R -> when have == required, try to shrink L and record the min window
```
```python
from collections import Counter
def min_window(s, t):
    if not t or not s: return ""
    need = Counter(t)
    missing = len(t)                  # total chars still needed (with dups)
    left = start = 0
    end = float('inf')
    for right, c in enumerate(s):
        if need[c] > 0:
            missing -= 1
        need[c] -= 1                  # may go negative for extra chars
        while missing == 0:           # window valid -> shrink
            if right - left < end - start:
                start, end = left, right
            need[s[left]] += 1
            if need[s[left]] > 0:
                missing += 1
            left += 1
    return "" if end == float('inf') else s[start:end + 1]
# O(|s| + |t|)
```

## Valid Anagram (frequency compare — recap)
```python
from collections import Counter
def is_anagram(a, b):
    return Counter(a) == Counter(b)
```

## Practice
| Problem | Technique |
|---|---|
| Longest Substring Without Repeating Chars | window + last-index map |
| Find All Anagrams in a String | fixed window + freq compare |
| Permutation in String | fixed window + freq compare |
| Minimum Window Substring | dynamic window + need/missing counts |
| Longest Repeating Character Replacement | window + freq of most-common char |

## Pitfalls
- When comparing window maps, **delete zero-count keys** (or compare carefully).
- Window length is `right - left + 1` (off-by-one trap).
- For Minimum Window, track *how many required chars remain* (`missing`), not just
  whether each is present.

## Related
- Combines [[hashing-02-frequency-map]] + [[arrays-04-sliding-window]] + [[hashing-03-set-lookup]]
- Back to the hub: [[hashing-00-roadmap]]

---
title: Strings 02 · Two Pointers & Window
phase: 2
tags: [dsa, strings, two-pointers, sliding-window]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Two pointers — palindromes & comparisons
Walk one pointer from each end toward the middle.
```
 "racecar"
  ^L         ^R     compare s[L] vs s[R]; move inward
```
```python
def is_palindrome(s):
    s = [c.lower() for c in s if c.isalnum()]   # normalize
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1; r -= 1
    return True
```

## Sliding window — "substring such that …"
Grow `right` to include more; **shrink `left` while the window is invalid**. Track
the answer. O(n). The character-count map is the window's state.
```
 longest substring without repeating chars: "abcabcbb"
   [a b c] then 'a' repeats -> move left past the old 'a'
```
```python
def longest_unique(s):
    last = {}                      # char -> last index seen
    left = best = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1     # jump left past the duplicate
        last[c] = right
        best = max(best, right - left + 1)
    return best
```

## Window with a "need" count — Minimum Window Substring (hard, but the template)
Expand to satisfy all required chars, then shrink to the smallest valid window.
```python
from collections import Counter
def min_window(s, t):
    if not t or not s: return ""
    need = Counter(t)
    missing = len(t)               # required chars still unmet (with dups)
    left = start = 0; end = float('inf')
    for right, c in enumerate(s):
        if need[c] > 0: missing -= 1
        need[c] -= 1
        while missing == 0:        # valid -> try to shrink
            if right - left < end - start:
                start, end = left, right
            need[s[left]] += 1
            if need[s[left]] > 0: missing += 1
            left += 1
    return "" if end == float('inf') else s[start:end + 1]
```

## Fixed-size window — Find All Anagrams / Permutation in String
Slide a window of length `len(p)`; compare its char-count to `p`'s.
```python
from collections import Counter
def find_anagrams(s, p):
    if len(p) > len(s): return []
    need, win = Counter(p), Counter(s[:len(p)])
    res = []
    for i in range(len(p), len(s) + 1):
        if win == need: res.append(i - len(p))
        if i < len(s):
            win[s[i]] += 1
            win[s[i-len(p)]] -= 1
            if win[s[i-len(p)]] == 0: del win[s[i-len(p)]]   # keep maps comparable
    return res
```

## Complexity
All O(n) (each char enters/leaves the window once). Window length is `right-left+1`.

## Canonical problems
| Problem | Pattern |
|---|---|
| Valid Palindrome | two pointers |
| Longest Substring Without Repeating Chars | dynamic window |
| Longest Repeating Character Replacement | window + most-frequent count |
| Minimum Window Substring | window + need/missing |
| Find All Anagrams / Permutation in String | fixed window + freq compare |

## Gotchas
- Shrink `left` **while invalid**; update the answer at the right moment (longest = after
  valid; shortest = while shrinking).
- Comparing count maps: **delete zero-count keys** so equality works.

## Next
- [[strings-03-frequency-advanced]] — anagrams, expand-around-center, encode/decode
- Deep dive on the window: [[hashing-06-strings-window]]

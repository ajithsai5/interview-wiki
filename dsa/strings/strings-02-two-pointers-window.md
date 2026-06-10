---
title: Strings 02 · Two Pointers & Window
phase: 2
tags: [dsa, strings, two-pointers, sliding-window]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Two pointers — palindromes & comparisons
Walk one pointer from each end toward the middle, comparing as you go. O(n) time,
O(1) extra space.
```
 "racecar"
  ^L         ^R     s[L]==s[R]? yes -> move inward
    ^L     ^R       ...
      ^L ^R         meet -> it's a palindrome
```
```python
def is_palindrome(s):
    s = [c.lower() for c in s if c.isalnum()]   # normalize: drop spaces/punct
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1; r -= 1
    return True
```
> Variation — *Valid Palindrome II* (delete at most one char): when `s[l] != s[r]`,
> try skipping **either** side and check if the remainder is a palindrome.

## Sliding window — "substring such that …"
Grow `right` to include more; **shrink `left` while the window is invalid**; record the
answer. Each char enters and leaves once → **O(n)**. The window's *state* is usually a
char-count map or a set.

### Dry run — longest substring without repeating chars on `"abcabcbb"`
```
 r c  window        action                         best
 0 a  [a]           add                            1
 1 b  [a b]         add                            2
 2 c  [a b c]       add                            3
 3 a  [a b c a]     'a' repeats -> left jumps past old a -> [b c a]   3
 4 b  [b c a b]     'b' repeats -> [c a b]         3
 5 c  ...                                          3
 -> answer 3 ("abc")
```
```python
def longest_unique(s):
    last = {}                      # char -> last index seen
    left = best = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1     # jump left past the duplicate (don't crawl)
        last[c] = right
        best = max(best, right - left + 1)
    return best
```

## Window with a "need" count — Minimum Window Substring (the template)
Expand until the window contains all required chars, then shrink to the smallest valid
window, recording the best. Track `missing` = required chars still unmet.
```python
from collections import Counter
def min_window(s, t):
    if not t or not s: return ""
    need = Counter(t)
    missing = len(t)               # total required chars (with multiplicity)
    left = start = 0; end = float('inf')
    for right, c in enumerate(s):
        if need[c] > 0: missing -= 1
        need[c] -= 1                # may go negative for extra/irrelevant chars
        while missing == 0:        # window valid -> try to shrink from the left
            if right - left < end - start:
                start, end = left, right
            need[s[left]] += 1
            if need[s[left]] > 0: missing += 1
            left += 1
    return "" if end == float('inf') else s[start:end + 1]
```

## Fixed-size window — Find All Anagrams / Permutation in String
When the window length is fixed (`len(p)`), slide it and compare its char-count to
`p`'s — updating counts in O(1) as it moves.
```python
from collections import Counter
def find_anagrams(s, p):
    if len(p) > len(s): return []
    need, win = Counter(p), Counter(s[:len(p)])
    res = []
    for i in range(len(p), len(s) + 1):
        if win == need: res.append(i - len(p))
        if i < len(s):
            win[s[i]] += 1                       # char entering
            left = s[i - len(p)]
            win[left] -= 1                       # char leaving
            if win[left] == 0: del win[left]     # keep maps comparable
    return res
```

## Fixed vs dynamic window — how to tell
```
 "of size k" / fixed length          -> fixed window (slide, swap one in/out)
 "longest/shortest ... such that X"  -> dynamic window (grow right, shrink left)
```

## Complexity
All O(n): each character is added and removed from the window at most once. Comparing
count maps is O(alphabet) ≈ O(1).

## Canonical problems
| Problem | Pattern | Approach |
|---|---|---|
| Valid Palindrome | two pointers | normalize, compare ends inward |
| Valid Palindrome II | two pointers | on mismatch, skip one side and recheck |
| Longest Substring Without Repeating Chars | dynamic window | last-index map, jump `left` |
| Longest Repeating Character Replacement | dynamic window | window valid if `len - maxFreq ≤ k` |
| Minimum Window Substring | dynamic window | `need`/`missing`, shrink when valid |
| Find All Anagrams / Permutation in String | fixed window | compare count maps |

## Gotchas
- Shrink `left` **while invalid**; update the answer at the right moment (longest =
  *after* the window is valid; shortest = *while* shrinking).
- Comparing count maps: **delete zero-count keys** so `==` works.
- "Repeating character replacement": the window is valid while
  `window_len - most_frequent_count ≤ k`.

## Next
- [[strings-03-frequency-advanced]] — anagrams, expand-around-center, encode/decode
- Deep dive on the window: [[hashing-06-strings-window]]

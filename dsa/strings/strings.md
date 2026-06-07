---
title: Strings
phase: 2
tags: [dsa, strings, two-pointers, sliding-window]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
Strings are just **arrays of characters**, so the same patterns apply — plus a few
string-specific ones. Most interview string problems are one of: **frequency map**,
**two pointers**, **sliding window**, or **expand-around-center**.

> Python note: strings are **immutable** — building a result char-by-char with `+`
> is O(n²). Collect into a `list` and `"".join(...)` it, which is O(n).

## Pattern 1 — Frequency map (anagrams)
Two strings are anagrams iff their character counts match.
```python
from collections import Counter
def is_anagram(a, b):
    return Counter(a) == Counter(b)          # O(n)

def group_anagrams(words):
    groups = {}
    for w in words:
        key = tuple(sorted(w))               # or a 26-length count tuple
        groups.setdefault(key, []).append(w)
    return list(groups.values())
```

## Pattern 2 — Two pointers (palindromes)
```python
def is_palindrome(s):
    s = [c.lower() for c in s if c.isalnum()]
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return False
        l += 1; r -= 1
    return True
```

## Pattern 3 — Sliding window (substring constraints)
"Longest/shortest substring such that …" → grow `right`, shrink `left` while invalid.
```python
def longest_unique(s):
    last = {}                      # char -> last index seen
    left = best = 0
    for right, c in enumerate(s):
        if c in last and last[c] >= left:
            left = last[c] + 1     # jump past the duplicate
        last[c] = right
        best = max(best, right - left + 1)
    return best
```
(Minimum Window Substring, Find All Anagrams, Permutation in String are the same
shape with a `need`/`window` count map.)

## Pattern 4 — Expand around center (palindromic substrings)
Each of the `2n-1` centers (each char, and each gap) expands outward while it stays
a palindrome. **O(n²)**, O(1) space.
```python
def longest_palindrome(s):
    res = ""
    def grow(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        return s[l+1:r]
    for i in range(len(s)):
        res = max(res, grow(i, i), grow(i, i+1), key=len)  # odd & even centers
    return res
```

## Complexity
- Frequency / two-pointer / sliding window: **O(n)**.
- Expand-around-center: **O(n²)** time, O(1) space (fine for typical limits).
- Sorting-based anagram key: O(n·k log k) for k-length words.

## Canonical problems (NeetCode)
| Problem | Pattern |
|---|---|
| Valid Anagram · Group Anagrams | frequency map |
| Valid Palindrome | two pointers |
| Longest Substring Without Repeating Chars | sliding window |
| Minimum Window Substring | sliding window + need/have counts |
| Longest Repeating Character Replacement | window + most-frequent char |
| Palindromic Substrings · Longest Palindromic Substring | expand around center |
| Encode and Decode Strings | length-prefix framing |
| Valid Parentheses | stack ([[stack]]) |

## Gotchas / re-solve notes
- Build results with a **list + `join`**, never repeated `+=` on a string.
- Sliding-window length is `right - left + 1` (off-by-one trap).
- For anagram keys, a **26-int count tuple** is faster than `sorted()` for long words.
- Watch case/spaces/punctuation in palindrome problems — normalize first.

## Related
- Same engines as [[arrays-03-two-pointers]], [[arrays-04-sliding-window]], [[hashing-02-frequency-map]]
- Substring+window deep-dive: [[hashing-06-strings-window]]

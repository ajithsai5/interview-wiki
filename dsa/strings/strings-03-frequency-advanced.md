---
title: Strings 03 · Frequency & Advanced
phase: 2
tags: [dsa, strings, frequency, palindrome]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Frequency maps — anagrams
Two strings are anagrams iff their character counts match.
```python
from collections import Counter
def is_anagram(a, b):
    return Counter(a) == Counter(b)            # O(n)

def group_anagrams(words):
    groups = {}
    for w in words:
        key = tuple(sorted(w))                 # or a 26-int count tuple
        groups.setdefault(key, []).append(w)
    return list(groups.values())
```

## Expand around center — palindromic substrings
Every palindrome has a center: each of the `n` chars (odd length) and each of the
`n-1` gaps (even length). Expand outward from each. **O(n²)** time, O(1) space.
```
 centers of "aba":  a | b | a  and the gaps between
 expand from center 'b': a<-b->a  -> "aba"
```
```python
def count_palindromes(s):
    total = 0
    def grow(l, r):
        c = 0
        while l >= 0 and r < len(s) and s[l] == s[r]:
            c += 1; l -= 1; r += 1
        return c
    for i in range(len(s)):
        total += grow(i, i)        # odd-length centers
        total += grow(i, i + 1)    # even-length centers
    return total

def longest_palindrome(s):
    best = ""
    def grow(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        return s[l+1:r]
    for i in range(len(s)):
        best = max(best, grow(i, i), grow(i, i+1), key=len)
    return best
```

## Encode / decode strings (framing)
To pack a list of arbitrary strings into one (and back), prefix each with its length
+ a delimiter, so the decoder knows exactly how many chars to read.
```python
def encode(strs):
    return "".join(f"{len(s)}#{s}" for s in strs)

def decode(s):
    res, i = [], 0
    while i < len(s):
        j = s.index("#", i)            # read the length
        length = int(s[i:j])
        res.append(s[j+1 : j+1+length])
        i = j + 1 + length
    return res
```

## Complexity
- Anagram compare/group: O(n) per word (or O(k log k) with `sorted`).
- Expand-around-center: O(n²) time, O(1) space — fine for typical limits.

## Canonical problems
| Problem | Idea |
|---|---|
| Valid Anagram · Group Anagrams | frequency map / sorted key |
| Palindromic Substrings · Longest Palindromic Substring | expand around center |
| Encode and Decode Strings | length-prefix framing |
| Longest Palindrome (build) | count chars; pairs + one odd center |

## Gotchas
- For anagram keys, a **26-int count tuple** beats `sorted()` on long words.
- Expand-around-center: do **both** odd (`i,i`) and even (`i,i+1`) centers.
- Encoding: a length prefix is robust to any delimiter appearing inside the data.

## Related
- Builds on [[hashing-02-frequency-map]]; window problems in [[strings-02-two-pointers-window]]
- Back to [[strings-00-roadmap]]

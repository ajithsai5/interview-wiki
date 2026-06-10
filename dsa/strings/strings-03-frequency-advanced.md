---
title: Strings 03 · Frequency & Advanced
phase: 2
tags: [dsa, strings, frequency, palindrome]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Frequency maps — anagrams
Two strings are anagrams iff their character counts match. Three ways, fastest last:
```python
from collections import Counter
def is_anagram(a, b):
    return Counter(a) == Counter(b)            # O(n), clean

def is_anagram_fast(a, b):                     # O(n), no dict overhead (a-z)
    if len(a) != len(b): return False
    cnt = [0] * 26
    for x, y in zip(a, b):
        cnt[ord(x) - ord('a')] += 1
        cnt[ord(y) - ord('a')] -= 1
    return all(v == 0 for v in cnt)
```

### Group anagrams — key by the *signature*
All anagrams share the same sorted letters (or the same 26-count tuple). Use that as
a dict key.
```
 "eat","tea","ate"  -> key ('a','e','t')  -> one bucket
 "tan","nat"        -> key ('a','n','t')  -> another bucket
```
```python
from collections import defaultdict
def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        key = tuple(sorted(w))                 # or a 26-int count tuple (faster)
        groups[key].append(w)
    return list(groups.values())
```

## Expand around center — palindromic substrings
Every palindrome has a center: each of the `n` chars (odd length) **and** each of the
`n-1` gaps (even length) — `2n-1` centers. Expand outward from each while the two sides
match. **O(n²)** time, O(1) space.
```
 centers of "aba":  a | b | a   plus the gaps between them
 expand from center 'b':  a < b > a   -> "aba"  (length 3)
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
        total += grow(i, i)        # odd-length centers (single char)
        total += grow(i, i + 1)    # even-length centers (between chars)
    return total

def longest_palindrome(s):
    best = ""
    def grow(l, r):
        while l >= 0 and r < len(s) and s[l] == s[r]:
            l -= 1; r += 1
        return s[l+1:r]            # l,r overshoot by one
    for i in range(len(s)):
        best = max(best, grow(i, i), grow(i, i+1), key=len)
    return best
```

## Build a palindrome — count parity
"Longest palindrome you can build from these letters": every char used in **pairs**,
plus one odd char in the middle.
```python
from collections import Counter
def longest_buildable(s):
    cnt = Counter(s)
    length = sum(v // 2 * 2 for v in cnt.values())
    if length < len(s): length += 1      # one odd char can sit in the middle
    return length
```

## Encode / decode strings (length-prefix framing)
To pack a list of arbitrary strings into one and recover it, prefix each with its
length + a delimiter — robust even if the data contains the delimiter.
```python
def encode(strs):
    return "".join(f"{len(s)}#{s}" for s in strs)

def decode(s):
    res, i = [], 0
    while i < len(s):
        j = s.index("#", i)                  # read the length up to '#'
        length = int(s[i:j])
        res.append(s[j+1 : j+1+length])      # then read exactly that many chars
        i = j + 1 + length
    return res
```

## Complexity
| Task | Cost |
|---|---|
| anagram compare / group | O(n) per word (or O(k log k) with `sorted`) |
| expand-around-center | O(n²) time, O(1) space |
| encode/decode | O(total length) |

## Canonical problems
| Problem | Idea / approach |
|---|---|
| Valid Anagram | compare two frequency maps |
| Group Anagrams | bucket by sorted-letters / 26-count key |
| Palindromic Substrings | expand from each of `2n-1` centers |
| Longest Palindromic Substring | expand-around-center, keep the longest |
| Longest Palindrome (build) | pairs + one odd center |
| Encode and Decode Strings | length-prefix framing |

## Variations & follow-ups
- "Longest Palindromic *Subsequence*" (not substring) → that's **2-D DP**, not expand-center.
- Group anagrams with huge words → prefer the **26-count tuple** key over `sorted`.
- Streaming anagram checks (Find All Anagrams) → fixed sliding window ([[strings-02-two-pointers-window]]).

## Gotchas
- For anagram keys, a **26-int count tuple** beats `sorted()` on long words.
- Expand-around-center: do **both** odd (`i,i`) and even (`i,i+1`) centers, or you miss
  even-length palindromes.
- Encoding: a length prefix survives any delimiter appearing inside the payload.

## Related
- Builds on [[hashing-02-frequency-map]]; window problems in [[strings-02-two-pointers-window]]
- Back to [[strings-00-roadmap]]

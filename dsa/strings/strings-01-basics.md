---
title: Strings 01 · Basics
phase: 2
tags: [dsa, strings, basics]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## A string is a sequence of characters
Index it like an array (`s[i]`), slice it (`s[l:r]`), loop it. The one big
difference from arrays: in Python, Java, JS, and C# **strings are immutable** — you
cannot change a character in place; any "edit" creates a new string.

```
 s = "hello"
  index:  0 1 2 3 4
          h e l l o
  s[0] = 'H'   ->  ERROR (immutable)
  s[1:4]       ->  "ell"   (a new string, chars 1,2,3)
  s[::-1]      ->  "olleh" (reversed)
```

## The #1 performance trap — building strings with `+`
Each `+=` copies the **entire** string built so far, so a loop is **O(n²)**. Collect
into a list and **join once** — O(n). This single mistake is a common interview ding.
```python
# BAD: O(n^2) — every += rebuilds the whole string
out = ""
for c in chars:
    out += c

# GOOD: O(n) — one allocation at the end
parts = []
for c in chars:
    parts.append(c)
out = "".join(parts)
```
```
 why O(n^2):  "" + a -> "a" (copy 1)
              "a" + b -> "ab" (copy 2)
              "ab" + c -> "abc" (copy 3)   ...  1+2+3+...+n = n^2/2
```

## Everyday operations (know these cold)
```python
s.lower(), s.upper()           # case
s.strip()                      # trim surrounding whitespace
s.split(",")                   # "a,b,c" -> ["a","b","c"]; s.split() splits on any whitespace
",".join(list_of_strings)      # list -> string
s.replace("a", "b")            # all occurrences
s.startswith("ab"), s.endswith("z")
s.find("x")                    # first index, or -1 ;  s.index raises if missing
s.count("a")                   # occurrences
c.isalnum(), c.isdigit(), c.isalpha(), c.isspace()
ord("a")  # 97      chr(97)  # "a"            <- char <-> integer code
```

## Char ↔ index, and the 26-letter count array
For lowercase-only problems, map `'a'..'z'` to `0..25` for an O(1) fixed array (faster
than a dict).
```python
idx = ord(c) - ord('a')        # 'a'->0, 'z'->25
count = [0] * 26
for c in s:
    count[ord(c) - ord('a')] += 1
```
Two char-count maps two ways:
```python
from collections import Counter
freq = Counter(s)              # {'l': 2, 'h': 1, ...}  (dict-like, any chars)
```

## "Editing" an immutable string
Convert to a `list` (mutable), change it, then `join`.
```python
chars = list(s)                # mutable copy
chars[0] = chars[0].upper()
s = "".join(chars)
```

## Worked example — reverse words in a sentence
Combine `split` + reverse + `join`.
```python
def reverse_words(s):
    return " ".join(s.split()[::-1])      # "the sky is" -> "is sky the"
```

## Complexity
| Operation | Cost |
|---|---|
| index `s[i]` / length | O(1) |
| slice `s[l:r]` | **O(r - l)** (it copies) |
| `+`/`+=` concatenation | O(len) — O(n²) in a loop |
| `in` / `find` substring | O(n·m) naive |
| `"".join(list)` | O(total length) |

## Gotchas
- **Immutable** — to mutate, go via `list(s)` then `"".join(...)`.
- Build results with **list + join**, never `+=` in a loop.
- `s.split()` (no arg) splits on runs of whitespace and drops empties; `s.split(" ")`
  keeps empty strings — pick deliberately.
- `find` returns `-1` when missing; `index` **raises** — choose based on whether you
  want to branch or fail.

## Interview variations
- Reverse a string **in place** (it's given as a char array) → two pointers, O(1) space.
- Reverse only words / only letters / by groups of k → split/slice tricks.
- Case-insensitive / ignore non-alphanumerics → normalize first with `isalnum()`/`lower()`.

## Next
- [[strings-02-two-pointers-window]] — palindromes & substring windows

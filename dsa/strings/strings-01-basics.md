---
title: Strings 01 · Basics
phase: 2
tags: [dsa, strings, basics]
group: Strings
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## A string is a sequence of characters
Index it like an array (`s[i]`), slice it (`s[l:r]`), loop it. The one big
difference from arrays: in most languages (Python, Java) **strings are immutable** —
you can't change a character in place.

```
 s = "hello"
  index: 0 1 2 3 4
         h e l l o
 s[0]='H'   ->  ERROR (immutable)
```

## The #1 performance trap — building strings
Concatenating with `+` in a loop is **O(n²)** (each `+` copies the whole string so far).
Collect into a list and **join once** — O(n).
```python
# BAD: O(n^2)
out = ""
for c in chars:
    out += c

# GOOD: O(n)
parts = []
for c in chars:
    parts.append(c)
out = "".join(parts)
```

## Everyday operations (know these cold)
```python
s.lower(), s.upper()
s.strip()                      # trim whitespace
s.split(",")                   # -> list of pieces
",".join(list_of_strings)      # list -> string
s.replace("a", "b")
s.find("x")                    # index or -1
c.isalnum(), c.isdigit(), c.isalpha()
ord("a")  # 97   chr(97) # "a"     <- char <-> code
list(s)                        # mutable copy you CAN edit, then "".join(it)
```

## Char counting two ways
```python
from collections import Counter
freq = Counter(s)              # {'l': 2, 'h': 1, ...}

# fixed 26-letter array (fast for a-z only)
count = [0] * 26
for c in s:
    count[ord(c) - ord('a')] += 1
```

## Reverse / check basics
```python
s[::-1]                        # reversed string
s == s[::-1]                   # naive palindrome check (O(n) space)
```

## Complexity
- Index/length: O(1). Slice `s[l:r]`: **O(r-l)** (it copies). Concatenate: O(len).
- `in` substring search: O(n·m) naive; built-ins are optimized but treat as O(n·m).

## Gotchas
- **Immutable** — to "edit", convert to `list(s)`, mutate, then `"".join(...)`.
- Build results with **list + join**, never `+=` in a loop.
- `ord`/`chr` and the **26-int count array** are your fast tools for letter problems.

## Next
- [[strings-02-two-pointers-window]] — palindromes & substring windows

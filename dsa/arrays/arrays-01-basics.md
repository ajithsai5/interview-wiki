---
title: Arrays 01 · Basics & Complexity
phase: 2
tags: [dsa, arrays, basics, complexity]
status: new
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## What is an array?
A **contiguous block of memory** holding items of the same type, laid out one
after another. Because the items are evenly spaced, the computer can jump
straight to any one of them using its **index** — no scanning required.

```
 index ->   0     1     2     3     4
          +-----+-----+-----+-----+-----+
   arr =  |  10 |  20 |  30 |  40 |  50 |
          +-----+-----+-----+-----+-----+
 memory:   100   104   108   112   116      (4 bytes apart)
```

`arr[3]` is found by math, not searching: `address = start + index * item_size`
= `100 + 3*4 = 112`. That one-step jump is why **access is O(1)**.

> Key idea: indexes start at **0**. The last valid index is `length - 1`.
> Reading `arr[length]` is out of bounds — a classic off-by-one bug.

## The five core operations
```
Access  arr[2]              -> read/return 30            O(1)
Update  arr[2] = 99         -> overwrite in place        O(1)
Search  "is 40 here?"       -> may scan all n items      O(n)
Insert at end (dynamic)     -> usually just append       O(1) amortized
Insert/Delete in middle     -> shift everything over     O(n)
```

**Why insert/delete in the middle is O(n)** — to insert 25 at index 2, every
element from index 2 onward must shuffle right to make a hole:

```
 insert 25 at index 2:
          +----+----+----+----+----+----+
 before   | 10 | 20 | 30 | 40 | 50 |    |
          +----+----+----+----+----+----+
                      \    \    \    (shift right)
          +----+----+----+----+----+----+
 after    | 10 | 20 | 25 | 30 | 40 | 50 |
          +----+----+----+----+----+----+
```

## Complexity cheat-sheet
| Operation | Time | Why |
|---|---|---|
| Access `arr[i]` | **O(1)** | direct address math |
| Update `arr[i]=x` | **O(1)** | overwrite in place |
| Search (unsorted) | **O(n)** | might check every element |
| Insert at end | **O(1) amortized** | occasionally resizes (see below) |
| Insert/delete middle | **O(n)** | shift the tail |

## Fixed-size vs dynamic arrays
- **Fixed-size** (C array, Java `int[]`): length set at creation, can't grow.
- **Dynamic** (Python `list`, Java `ArrayList`, C++ `vector`): grows automatically.

**"Amortized O(1)"** for append: a dynamic array keeps spare capacity. Most
appends just drop the value into a free slot (O(1)). When it fills up, it
**doubles** its capacity and copies everything once (O(n)) — but that cost is
spread across the many cheap appends, so the *average* is O(1).

```
 capacity doubling:  [_] -> [x _] -> [x x _ _] -> [x x x x _ _ _ _] ...
                      1       2          4               8
```

## Starter practice (write these from scratch)
```python
arr = [10, 20, 30, 40, 50]

print(arr)                       # 1. print the array
print(arr[::-1])                 # 2. reverse  -> [50, 40, 30, 20, 10]
print(max(arr), min(arr))        # 3. max / min
print(sum(arr))                  # 4. sum of elements
evens = sum(1 for x in arr if x % 2 == 0)   # 5. count evens
odds  = len(arr) - evens
```

Do them once with built-ins, then **again with explicit loops** (no `sum`/`max`)
so you understand what the built-ins hide.

## Common pitfalls
- **Off-by-one**: last index is `n-1`, loops use `range(n)` / `i < n`.
- **Aliasing**: `b = a` copies the *reference*, not the data — editing `b` edits
  `a`. Use `b = a[:]` or `b = list(a)` for a real copy.
- Confusing **index** (position) with **value** (what's stored there).

## Related
- Next: [[arrays-02-traversal]] — looping patterns you'll reuse everywhere
- Big-picture: [[arrays-00-roadmap]] · the seeded [[arrays-01-basics]] page for complexity depth

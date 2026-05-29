---
title: Hashing 01 · Fundamentals
phase: 2
tags: [dsa, hashing, basics]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## What is hashing?
Hashing stores data as **`key → value`** pairs and lets you find any key in (on
average) **one step**. A *hash function* converts a key into an array index (a
"bucket"), so lookups don't scan — they jump.

```
 store:  {"apple": 3, "banana": 5}

            hash("apple") = 7      hash("banana") = 2
            +---+---+---+---+---+---+---+----------+
 buckets ->  0   1  [banana:5] ...           [apple:3]
                        ^2                        ^7
 lookup "apple" -> hash -> bucket 7 -> value 3   (one hop, O(1))
```

Used for: **fast lookup, frequency counting, duplicate detection, caching, pair
finding.**

## The two structures
**HashMap / Dictionary** — stores `key → value`.

| Language | Type |
|---|---|
| Python | `dict` |
| Java | `HashMap` |
| C++ | `unordered_map` |

**HashSet** — stores **unique keys only** (membership, no values).

| Language | Type |
|---|---|
| Python | `set` |
| Java | `HashSet` |
| C++ | `unordered_set` |

```python
m = {}                 # dict / hashmap
m["apple"] = 3
m.get("pear", 0)       # 0 if missing (no KeyError)

s = set()              # hashset
s.add(4)
4 in s                 # True  -> O(1) membership
```

## Time complexity (why hashing is powerful)
| Operation | Average | Worst* |
|---|---|---|
| Insert | **O(1)** | O(n) |
| Search / lookup | **O(1)** | O(n) |
| Delete | **O(1)** | O(n) |

\*Worst case happens only under many hash **collisions** (lots of keys landing in
the same bucket). In interviews you quote **O(1) average** but should know the
worst case exists.

## How it works under the hood (collisions)
Two keys can hash to the same bucket — a **collision**. Common fix: each bucket
holds a small list ("chaining"); within a bucket you do a tiny linear scan.

```
 hash(k1) = hash(k3) = 2     (collision)
 bucket 2 -> [k1:v1] -> [k3:v3]      (a short chain)
```
Good hash functions spread keys evenly so chains stay tiny → effectively O(1).

## Ordering note
- Python `dict` preserves **insertion order** (since 3.7); `set` does **not**
  guarantee order.
- Need keys sorted? That's a different structure (tree map / sorted container),
  usually **O(log n)** — don't claim O(1) if the problem needs ordering.

## Keys must be hashable
You can hash immutable things (numbers, strings, tuples) but **not lists/dicts**.
Convert a list to a `tuple` to use it as a key (e.g. grouping anagrams by a sorted
letter tuple).

```python
groups = {}
key = tuple(sorted("eat"))      # ('a','e','t')  -> hashable
groups.setdefault(key, []).append("eat")
```

## Practice (warm-ups)
```python
arr = [1, 1, 2, 3, 3, 3]
# frequency map
freq = {}
for x in arr:
    freq[x] = freq.get(x, 0) + 1     # {1:2, 2:1, 3:3}
# membership set
present = set(arr)                    # {1, 2, 3}
```

## Pitfalls
- `dict[missing]` raises `KeyError` — use `.get(k, default)` or `collections.defaultdict`.
- Don't use a **list** for membership tests (`x in list` is O(n)); use a **set** (O(1)).
- Sets/maps need **hashable** keys.

## Related
- Next: [[hashing-02-frequency-map]] · the whole map: [[hashing-00-roadmap]]
- Seeded deep-dive: [[hashing]] · complexity: [[big-o]]

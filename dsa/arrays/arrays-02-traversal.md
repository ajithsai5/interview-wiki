---
title: Arrays 02 · Traversal Patterns
phase: 2
tags: [dsa, arrays, traversal]
status: learning
anki: false
created: 2026-05-29
updated: 2026-05-29
---

## Why this matters
Almost every array algorithm is a traversal with a little bookkeeping. Get these
four shapes into your fingers and most problems become "which traversal + what do
I track?"

## 1. Forward traversal
Walk left → right. The default.

```
 i ->
 +----+----+----+----+----+
 | 10 | 20 | 30 | 40 | 50 |
 +----+----+----+----+----+
   ^0   1    2    3    4
```
```python
for i in range(len(arr)):     # index version
    print(i, arr[i])

for x in arr:                  # value version (cleaner when you don't need i)
    print(x)
```

## 2. Backward traversal
Walk right → left. Useful when building results from the end, or when deleting
while iterating (deleting from the back doesn't shift items you haven't seen yet).

```
                          <- i
 +----+----+----+----+----+
 | 10 | 20 | 30 | 40 | 50 |
 +----+----+----+----+----+
   0    1    2    3    4^
```
```python
for i in range(len(arr) - 1, -1, -1):
    print(arr[i])              # 50, 40, 30, 20, 10
```

## 3. Two simultaneous pointers
Two cursors moving through the array. The most common form starts one at each end
and moves them toward the middle — this is the seed of [[arrays-03-two-pointers]].

```
 reverse in place:  swap ends, move inward
 +----+----+----+----+----+
 | 10 | 20 | 30 | 40 | 50 |
 +----+----+----+----+----+
   ^L                  ^R       swap(L,R), L++, R--
```
```python
def reverse(arr):
    l, r = 0, len(arr) - 1
    while l < r:
        arr[l], arr[r] = arr[r], arr[l]
        l += 1
        r -= 1
    return arr
```

## 4. Nested traversal
A loop inside a loop — compares pairs. Simple but **O(n²)**; many "optimize this"
questions are really "remove the nested loop using two pointers / hashing / a window."

```python
for i in range(n):
    for j in range(i + 1, n):
        compare(arr[i], arr[j])     # every pair once -> O(n^2)
```

## Worked example — "is the array sorted ascending?"
Compare each element to its neighbor in one forward pass:
```
 +----+----+----+----+----+
 |  1 |  3 |  3 |  7 |  9 |
 +----+----+----+----+----+
    \__/ \__/ \__/ \__/      each pair must satisfy left <= right
```
```python
def is_sorted(arr):
    for i in range(1, len(arr)):
        if arr[i] < arr[i - 1]:
            return False
    return True
# O(n) time, O(1) space
```

## Practice
| Problem | Traversal used |
|---|---|
| Reverse array | two pointers (end → in) |
| Check sorted array | forward, compare neighbors |
| Second largest element | forward, track top-2 |
| Move Zeroes | two pointers (write index) |
| Rotate array | reverse-based trick (see below) |

**Second largest** (one pass, track two values):
```python
def second_largest(arr):
    first = second = float('-inf')
    for x in arr:
        if x > first:
            second, first = first, x
        elif first > x > second:
            second = x
    return second
```

**Rotate array right by k** (elegant reverse trick — no extra array):
```
 rotate [1,2,3,4,5] right by 2:
 1) reverse all      -> [5,4,3,2,1]
 2) reverse first k  -> [4,5,3,2,1]
 3) reverse rest     -> [4,5,1,2,3]   done
```
```python
def rotate(arr, k):
    k %= len(arr)
    arr.reverse()
    arr[:k] = reversed(arr[:k])
    arr[k:] = reversed(arr[k:])
```

## Pitfalls
- Modifying a list **while** iterating forward shifts indices — iterate backward
  or build a new list instead.
- Neighbor comparisons start the loop at `1` (compare `i` with `i-1`), not `0`.

## Related
- Next: [[arrays-03-two-pointers]] — the power-up of pattern #3 above
- Also: [[arrays-09-hashing]] (kills many nested loops) · [[arrays-00-roadmap]]

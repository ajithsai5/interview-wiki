---
title: Math & Bits 02 · Bit Problems
phase: 2
tags: [dsa, bit-manipulation]
group: Math & Bits
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Single Number — XOR all
Every value appears twice except one; XOR cancels the pairs, leaving the unique.
```python
def single_number(nums):
    out = 0
    for x in nums:
        out ^= x
    return out
```

## Number of 1 Bits (Hamming weight)
`x &= x - 1` drops the lowest set bit each loop — runs once per set bit.
```python
def hamming_weight(x):
    c = 0
    while x:
        x &= x - 1
        c += 1
    return c
```

## Counting Bits 0..n (DP on bits)
A number's bit count = its half's bit count plus its lowest bit.
```python
def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)     # dp[i//2] + lowest bit
    return dp
```

## Missing Number — XOR indices vs values
XOR all indices `0..n` and all values; matching pairs cancel, leaving the missing one.
```python
def missing_number(nums):
    out = len(nums)                      # start with n (the top index)
    for i, x in enumerate(nums):
        out ^= i ^ x
    return out
```

## Sum of Two Integers — add without `+`
`a ^ b` = sum without carry; `(a & b) << 1` = the carry. Repeat until no carry.
```python
def get_sum(a, b):
    mask = 0xFFFFFFFF
    while b & mask:
        a, b = (a ^ b) & mask, ((a & b) << 1) & mask
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)   # handle Python's big ints / sign
```

## Reverse Bits
Shift bits out of the input and into the result in reverse position.
```python
def reverse_bits(x):
    res = 0
    for _ in range(32):
        res = (res << 1) | (x & 1)
        x >>= 1
    return res
```

## Complexity
All O(1) for fixed-width ints (≤ 32/64 bit loops); Counting Bits is O(n).

## Canonical problems
| Problem | Trick |
|---|---|
| Single Number | XOR all |
| Number of 1 Bits | `x &= x-1` loop |
| Counting Bits | `dp[i] = dp[i>>1] + (i&1)` |
| Missing Number | XOR indices vs values (or sum formula) |
| Sum of Two Integers | XOR + carry loop |
| Reverse Bits | shift out / shift in |

## Gotchas
- `x & (x-1)` clears the lowest set bit — the engine of bit-count & power-of-two.
- XOR is self-inverse — perfect for "the one that doesn't pair up".
- "Add without +" needs **masking** in Python because ints don't overflow.

## Next
- [[math-03-number-theory]] — gcd, primes, fast power

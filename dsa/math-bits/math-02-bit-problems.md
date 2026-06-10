---
title: Math & Bits 02 · Bit Problems
phase: 2
tags: [dsa, bit-manipulation]
group: Math & Bits
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
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
```
 dry run [4,1,2,1,2]:  0^4=4, ^1=5, ^2=7, ^1=6, ^2=4  -> 4
 the two 1s and two 2s cancel; only 4 survives.
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
```
 dry run x=13 (1101): 1101 -> 1100 -> 1000 -> 0000, 3 iterations -> 3 ones
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
`i >> 1` is `i` with the last bit shaved off, so its count is already known — classic DP
reuse. (e.g. `dp[5]=dp[2]+1`, `dp[2]=dp[1]+0`, `dp[1]=dp[0]+1` → 5→`101` has 2 ones.)

## Missing Number — XOR indices vs values
XOR all indices `0..n` and all values; matching pairs cancel, leaving the missing one.
```python
def missing_number(nums):
    out = len(nums)                      # start with n (the top index)
    for i, x in enumerate(nums):
        out ^= i ^ x
    return out
```
(Alternative without bits: `n*(n+1)//2 - sum(nums)`.)

## Single Number II — every element thrice except one
XOR fails (it only cancels pairs). Count each bit position mod 3, or track `ones`/`twos`
with masks. The "sum each bit % 3" view is the clearest:
```python
def single_number_ii(nums):
    res = 0
    for b in range(32):
        bit_sum = sum((x >> b) & 1 for x in nums)
        if bit_sum % 3:                  # the lone number set this bit
            res |= 1 << b
    return res - (1 << 32 if res >= 1 << 31 else 0)   # sign-fix for 32-bit
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
| Problem | Approach |
|---|---|
| Single Number | XOR all (pairs cancel) |
| Single Number II | per-bit count mod 3 |
| Number of 1 Bits | `x &= x-1` loop, once per set bit |
| Counting Bits | DP: `dp[i] = dp[i>>1] + (i&1)` |
| Missing Number | XOR indices vs values (or sum formula) |
| Sum of Two Integers | XOR for sum + carry shift, masked |
| Reverse Bits | shift out of x, shift into res |

## Variations & follow-ups
- "Single Number III" (two uniques, rest paired) → XOR everything to get `a^b`, isolate a
  differing bit with `x & -x`, then partition and XOR each group separately.
- "Bitwise AND of Numbers Range" → the answer is the common high-bit prefix; shift both
  ends right until equal, then shift back.
- "Maximum XOR of Two Numbers" → build a binary trie, greedily pick opposite bits.

## Gotchas
- `x & (x-1)` clears the lowest set bit — the engine of bit-count & power-of-two.
- XOR is self-inverse — perfect for "the one that doesn't pair up" (but **not** for
  thrice-repeated — use per-bit mod 3).
- "Add without +" needs **masking** in Python because ints don't overflow.

## Next
- [[math-03-number-theory]] — gcd, primes, fast power

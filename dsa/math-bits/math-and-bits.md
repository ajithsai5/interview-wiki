---
title: Math & Bit Manipulation
phase: 2
tags: [dsa, math, bit-manipulation]
group: Math & Bits
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
Two small but high-yield areas:
- **Bit manipulation** — "without using +", "single number", "count bits", subsets via
  bitmask, flags. O(1)-ish tricks that look like magic until you know them.
- **Math** — overflow-safe tricks, digit problems, gcd, primes, fast power, geometry
  on grids (matrix rotate/spiral live in [[arrays-10-matrix]]).

## Bit operators (the toolkit)
```
 &  AND     x & 1     -> is x odd?            (lowest bit)
 |  OR      x | y     -> set bits
 ^  XOR     x ^ x = 0,  x ^ 0 = x            (the workhorse)
 ~  NOT     ~x = -x-1
 << >> shift  x << 1 = x*2,  x >> 1 = x//2
 x & (x-1)   -> clears the lowest set bit
 x & -x      -> isolates the lowest set bit
```

## The XOR trick — Single Number
Every number that appears twice cancels itself (`a ^ a = 0`); the lone one remains.
```python
def single_number(nums):
    out = 0
    for x in nums:
        out ^= x          # pairs cancel, the unique survives
    return out
```

## Counting bits / power-of-two
```python
def count_ones(x):
    c = 0
    while x:
        x &= x - 1        # drop the lowest set bit each step
        c += 1
    return c

def is_power_of_two(x):
    return x > 0 and (x & (x - 1)) == 0   # exactly one bit set
```

## Add without `+` (full-adder with bits)
`a ^ b` is the sum without carry; `(a & b) << 1` is the carry — repeat until no carry.
```python
def add(a, b):
    mask = 0xFFFFFFFF
    while b & mask:
        a, b = (a ^ b) & mask, ((a & b) << 1) & mask
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)
```

## Handy math
```python
import math
math.gcd(a, b)                 # Euclid's algorithm, O(log min)
pow(base, exp, mod)            # fast modular exponentiation, O(log exp)
# subsets via bitmask: for mask in range(1 << n): bits of mask = chosen items
```

## Complexity
- Bit ops are O(1); loops over the 32/64 bits are O(1) for fixed-width ints.
- `gcd` / fast power: **O(log n)**. Sieve of Eratosthenes (all primes ≤ n): O(n log log n).

## Canonical problems (NeetCode)
| Problem | Trick |
|---|---|
| Single Number | XOR all |
| Number of 1 Bits | `x &= x-1` loop |
| Counting Bits (0..n) | `dp[i] = dp[i >> 1] + (i & 1)` |
| Reverse Bits | shift out / shift in |
| Missing Number | XOR indices vs values (or sum formula) |
| Sum of Two Integers | XOR + carry loop |
| Pow(x, n) | fast exponentiation (halve the power) |

## Gotchas / re-solve notes
- **`x & (x-1)`** clears the lowest set bit — the basis of bit-count and power-of-two.
- XOR is its own inverse — great for "find the one that doesn't pair up".
- In Python ints are unbounded; bit problems that assume 32-bit need masking (`& 0xFFFFFFFF`).
- `pow(b, e, m)` is the fast, overflow-safe modular power — don't hand-roll it.

## Related
- Bitmask subsets connect to [[backtracking]]; grid math is in [[arrays-10-matrix]]
- "Counting Bits" is a tiny [[dynamic-programming|DP]]

---
title: Math & Bits 01 · Bit Basics
phase: 2
tags: [dsa, bit-manipulation, basics]
group: Math & Bits
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## The operators
```
 &   AND    1&1=1 else 0      x & 1   -> is the lowest bit set? (odd?)
 |   OR     sets bits         x | y
 ^   XOR    differ -> 1       x^x=0,  x^0=x   (the workhorse)
 ~   NOT    flips all bits    ~x = -x - 1
 <<  left   x << k = x * 2^k
 >>  right  x >> k = x // 2^k
```

## A number is bits
```
  13 = 1101₂        bit 0 (value 1):  1
                    bit 1 (value 2):  0
                    bit 2 (value 4):  1
                    bit 3 (value 8):  1
 set bit i:    x | (1 << i)
 clear bit i:  x & ~(1 << i)
 toggle bit i: x ^ (1 << i)
 test bit i:   (x >> i) & 1
```

## Truth-table intuition (when to use which)
```
 & : "keep only where BOTH on"  -> masking, testing a bit
 | : "turn bits ON"             -> setting flags, combining masks
 ^ : "flip where the mask is 1" -> toggling, cancellation, swap
 a ^ b twice == a               -> XOR is its own inverse
```

## The two tricks worth memorizing
```
 x & (x - 1)   -> clears the LOWEST set bit
                  13 (1101) & 12 (1100) = 1100   (the lowest 1 is gone)
 x & -x        -> ISOLATES the lowest set bit
                  13 & -13 = 1  (just that bit)
```
`x & (x-1)` powers bit-counting and "is power of two"; `x & -x` is used in Fenwick trees.

Why `x & (x-1)` clears the lowest 1: subtracting 1 flips the lowest set bit to 0 and turns
all the zeros below it into 1s; AND-ing with the original wipes that whole low run.
```
 x   = 1011 0100
 x-1 = 1011 0011     (lowest 1 became 0, trailing zeros became 1)
 x & = 1011 0000     (lowest set bit cleared)
```

## XOR — the cancellation magic
```
 a ^ a = 0        (anything XOR itself cancels)
 a ^ 0 = a
 XOR is commutative & associative -> order doesn't matter
```
So XOR-ing a list where everything pairs up except one leaves the loner. Bonus — swap two
numbers with no temp: `a ^= b; b ^= a; a ^= b`.

## Bitmask = a tiny set
An int's bits represent membership in a set of ≤ ~32 items. Enumerate all subsets:
```python
n = 3
for mask in range(1 << n):            # 0..2^n - 1
    subset = [i for i in range(n) if mask & (1 << i)]
```
Common mask ops: add `i` → `mask | (1<<i)`; remove → `mask & ~(1<<i)`; test → `mask &
(1<<i)`; count members → `bin(mask).count("1")`. This is the backbone of bitmask DP
(e.g. Travelling Salesman, "minimum cost to assign").

## Complexity
Bit ops are O(1); looping over the (fixed 32/64) bits is O(1) per number.

## Variations & follow-ups
- "Subset enumeration" → loop `mask` from 0 to `2^n − 1` (above).
- "Iterate submasks of a mask" → `sub = (sub - 1) & mask` trick (advanced, for DP).
- "Gray code" → `i ^ (i >> 1)` generates the reflected binary sequence.

## Gotchas
- Precedence: `&`, `|`, `^` bind **looser** than `==`/`+` — parenthesize, e.g. `(x >> i) & 1`.
- Python ints are unbounded; problems assuming **32-bit** need masking (`& 0xFFFFFFFF`).
- `x & 1` for odd/even is faster and clearer than `x % 2` in bit contexts.

## Next
- [[math-02-bit-problems]] — single number, counting bits, add without +

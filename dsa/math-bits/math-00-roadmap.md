---
title: Math & Bits 00 · Roadmap
phase: 2
tags: [dsa, math, bit-manipulation, roadmap, index]
group: Math & Bits
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
Two small, high-yield areas that show up as "tricky" easy/medium problems:
- **Bit manipulation** — XOR cancellation, bit masks, "without +", counting bits.
- **Math** — gcd, primes, fast power, overflow-safe tricks, digit problems.

## The path
1. [[math-01-bit-basics]] — the operators and the must-know bit tricks
2. [[math-02-bit-problems]] — single number, counting bits, missing number, add without +
3. [[math-03-number-theory]] — gcd, sieve of primes, fast power, modular arithmetic

## Pattern → reach-for-it
| Clue | Use |
|---|---|
| "appears twice except one" | XOR all — [[math-02-bit-problems]] |
| "count set bits / power of two" | `x & (x-1)` — [[math-01-bit-basics]] |
| "do it without + / using bits" | full-adder loop — [[math-02-bit-problems]] |
| "gcd / primes / x^n mod m" | number theory — [[math-03-number-theory]] |

## Related
- Bitmask subsets connect to [[backtracking-00-roadmap]]; grid/number geometry is in [[arrays-10-matrix]]; "counting bits" is a tiny [[arrays-13-dp|DP]]

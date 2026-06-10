---
title: Math & Bits 03 · Number Theory
phase: 2
tags: [dsa, math]
group: Math & Bits
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## GCD — Euclid's algorithm
The greatest common divisor: keep replacing `(a, b)` with `(b, a mod b)` until `b` is 0.
```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
# math.gcd(a, b) is built in;  lcm(a, b) = a * b // gcd(a, b)
```
```
 dry run gcd(48,18): (48,18)->(18,48%18=12)->(12,18%12=6)->(6,12%6=0)-> 6
```
O(log min(a, b)).

## Primes — Sieve of Eratosthenes
Find all primes ≤ n by crossing out multiples. O(n log log n).
```python
def primes_upto(n):
    sieve = [True] * (n + 1)
    sieve[0] = sieve[1] = False
    for i in range(2, int(n**0.5) + 1):
        if sieve[i]:
            for m in range(i*i, n + 1, i):     # start at i*i
                sieve[m] = False
    return [i for i, p in enumerate(sieve) if p]
```
Two optimizations baked in: only sieve up to `√n` (a composite has a factor ≤ its root),
and start crossing out at `i*i` (smaller multiples were already struck by smaller primes).

## Fast (modular) exponentiation — x^n
Square the base and halve the exponent → O(log n), and overflow-safe with a modulus.
```python
def power(x, n):
    if n < 0:
        x, n = 1 / x, -n
    res = 1
    while n:
        if n & 1:                # odd exponent -> multiply in current x
            res *= x
        x *= x                   # square the base
        n >>= 1                  # halve the exponent
    return res
# built-in & modular:  pow(x, n, mod)
```
```
 dry run 3^13 (13 = 1101): bits low->high 1,0,1,1
   bit1: res=3,  x=9
   bit0: x=81
   bit1: res=3*81=243, x=6561
   bit1: res=243*6561=1,594,323 = 3^13   (4 multiplies, not 13)
```

## Handy facts & tricks
```
 digits of n:        while n: d = n % 10; n //= 10
 reverse an int:     rev = rev * 10 + n % 10
 is power of two:    n > 0 and n & (n - 1) == 0
 overflow (32-bit):  clamp to [-2^31, 2^31 - 1]
 a % b in Python is always sign-of-b (no negative-mod surprises)
 count of base-b digits of n:  floor(log_b n) + 1
```

## Geometry-ish
Matrix rotate/spiral/transpose live in [[arrays-10-matrix]]. Most "math" interview
problems are really **digit manipulation** or **overflow handling**, not deep theory.

## Complexity
gcd O(log), sieve O(n log log n), fast power O(log n).

## Canonical problems
| Problem | Approach |
|---|---|
| Pow(x, n) | fast exponentiation (square-and-halve) |
| Count Primes | sieve of Eratosthenes |
| Greatest Common Divisor of Strings | gcd on the two lengths |
| Happy Number | cycle detection (set or fast/slow) on digit-square sums |
| Reverse Integer / Palindrome Number | digit loop + overflow clamp |
| Excel Sheet Column Number / Title | base-26 conversion |
| Factorial Trailing Zeroes | count factors of 5 |

## Variations & follow-ups
- "Happy Number" → it either reaches 1 or loops; detect the loop with a **set** or
  Floyd's fast/slow pointers (see [[linked-list-02-reverse-fastslow]]).
- "Factorial Trailing Zeroes" → zeros come from factors of 10 = 2·5, and 5s are scarcer,
  so count `n//5 + n//25 + n//125 + …`.
- "Ugly Number II" / "Super Ugly Number" → multi-pointer DP generating numbers whose only
  prime factors are in a given set.
- "Excel Column" is just base-26 but **1-indexed** (no zero digit) — subtract 1 each step.

## Gotchas
- Use the built-ins: `math.gcd`, `pow(x, n, mod)` — don't hand-roll and risk overflow.
- Sieve: start crossing out at `i*i`, step `i`.
- Watch the **32-bit overflow** clamp in reverse-integer style problems.

## Related
- Power-of-two & bit checks: [[math-01-bit-basics]]; matrix math: [[arrays-10-matrix]]
- Back to [[math-00-roadmap]]

---
title: Math & Bits 03 · Number Theory
phase: 2
tags: [dsa, math]
group: Math & Bits
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
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

## Handy facts & tricks
```
 digits of n:        while n: d = n % 10; n //= 10
 reverse an int:     rev = rev * 10 + n % 10
 is power of two:    n > 0 and n & (n - 1) == 0
 overflow (32-bit):  clamp to [-2^31, 2^31 - 1]
 a % b in Python is always sign-of-b (no negative-mod surprises)
```

## Geometry-ish
Matrix rotate/spiral/transpose live in [[arrays-10-matrix]]. Most "math" interview
problems are really **digit manipulation** or **overflow handling**, not deep theory.

## Complexity
gcd O(log), sieve O(n log log n), fast power O(log n).

## Canonical problems
| Problem | Tool |
|---|---|
| Pow(x, n) | fast exponentiation |
| Count Primes | sieve |
| Greatest Common Divisor of Strings | gcd on lengths |
| Happy Number | cycle detection (set) on digit-square sums |
| Reverse Integer / Palindrome Number | digit loop + overflow check |
| Excel Sheet Column Number | base-26 conversion |

## Gotchas
- Use the built-ins: `math.gcd`, `pow(x, n, mod)` — don't hand-roll and risk overflow.
- Sieve: start crossing out at `i*i`, step `i`.
- Watch the **32-bit overflow** clamp in reverse-integer style problems.

## Related
- Power-of-two & bit checks: [[math-01-bit-basics]]; matrix math: [[arrays-10-matrix]]
- Back to [[math-00-roadmap]]

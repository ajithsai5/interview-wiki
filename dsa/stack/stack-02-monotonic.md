---
title: Stack 02 · Monotonic Stack
phase: 2
tags: [dsa, stack, monotonic-stack]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## The idea
Keep the stack **sorted** (always increasing or always decreasing). When a new item
would break that order, **pop** — and each pop *resolves an answer*. Because each
element is pushed and popped at most once, the whole scan is **O(n)** even though the
`while` inside the `for` looks nested.

Use it for: **next greater / smaller element**, "days until warmer", stock span, and
as a building block for histogram / trapping-rain-water.

## Why it's O(n) (the amortization)
There are `n` pushes total. Each element can be popped **at most once**, so there are
≤ `n` pops total across the whole run. `n` pushes + `n` pops = O(n) — the inner `while`
doesn't make it quadratic.

## Template — Next Greater Element
Keep a **decreasing** stack of indices. A bigger value arriving is the "next greater"
for everything smaller sitting below it.

### Dry run on `[2, 1, 2, 4]`
```
 i=0 val 2:  stack empty -> push 0           stack(idx)=[0]   vals=[2]
 i=1 val 1:  1 < 2, keep -> push 1           [0,1]            [2,1]
 i=2 val 2:  2 > 1 -> pop 1 (ng[1]=2); 2==2 keep -> push 2   [0,2]  [2,2]
 i=3 val 4:  4 > 2 -> pop 2 (ng[2]=4); 4 > 2 -> pop 0 (ng[0]=4); push 3
 result ng = [4, 2, 4, -1]
```
```python
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                       # indices; nums[stack] strictly decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x     # x is the next-greater for the popped index
        stack.append(i)
    return res
```

## Worked example — Daily Temperatures
Same pattern; the answer is the **distance** to the warmer day, so store indices and
compute `i - poppedIndex`.
```python
def daily_temperatures(temps):
    res = [0] * len(temps)
    stack = []                       # indices, temps decreasing
    for i, t in enumerate(temps):
        while stack and temps[stack[-1]] < t:
            j = stack.pop()
            res[j] = i - j           # days waited
        stack.append(i)
    return res
```

## Increasing vs decreasing — how to choose
```
 "next GREATER" / "warmer / hotter"  -> keep a DECREASING stack (pop when bigger arrives)
 "next SMALLER"                      -> keep an INCREASING stack (pop when smaller arrives)
 "previous greater/smaller"          -> same, but read the stack top BEFORE pushing
```
Store **indices** (not just values) when you need distances or to fill a result array.

## Circular arrays (Next Greater Element II)
"Wrap around" → iterate `2n` times and index with `i % n`; only push during the first
pass (or guard so you don't re-add indices).

## Complexity
**O(n)** time (each index pushed/popped once), O(n) space.

## Canonical problems
| Problem | Stack direction | Note |
|---|---|---|
| Next Greater Element I / II | decreasing | II is circular |
| Daily Temperatures | decreasing (indices) | answer = distance |
| Online Stock Span | decreasing | count spans on pop |
| Sum of Subarray Minimums | increasing | contribution per element |
| Largest Rectangle in Histogram | increasing | width on pop ([[stack-03-problems]]) |
| Trapping Rain Water | decreasing / two pointers | [[arrays-12-advanced]] |

## Variations & follow-ups
- Need *previous* greater/smaller instead of *next*? Read `stack[-1]` **before** pushing `i`.
- Need the actual element, not the distance? Store/return values from the stack.
- Many "contribution to all subarrays" problems (subarray min sum) are monotonic-stack in disguise.

## Gotchas
- Decide **increasing vs decreasing** before coding, and keep the comparison consistent
  (`<` vs `<=` decides how ties are handled — matters for duplicate values).
- Store **indices** when you need the gap/position, not just the value.
- Don't forget unresolved items left on the stack have no "next" (default -1 / 0).

## Next
- [[stack-03-problems]] — RPN, histogram, path/decode, recursion→stack

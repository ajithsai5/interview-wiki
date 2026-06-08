---
title: Stack 02 · Monotonic Stack
phase: 2
tags: [dsa, stack, monotonic-stack]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## The idea
Keep the stack **sorted** (always increasing or always decreasing). When a new item
would break that order, **pop** — and each pop *resolves an answer*. Because each
element is pushed and popped at most once, the whole scan is **O(n)** even though it
looks nested.

Use it for: **next greater / smaller element**, "days until warmer", stock span,
and as a building block for histogram/rain-water.

## Template — Next Greater Element
Keep a **decreasing** stack of indices. A bigger value arriving is the "next greater"
for everything smaller below it.
```
 nums = [2, 1, 2, 4]
 i=0 push 2        stack(vals)=[2]
 i=1 push 1        [2,1]
 i=2 val 2 > 1 -> pop 1 (ng=2); 2 == 2 keep; push 2   [2,2]
 i=3 val 4 -> pop 2,2 (ng=4); push 4                  ng = [4,2,4,-1]
```
```python
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                       # indices; nums[stack] decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x     # x is the next-greater for the popped index
        stack.append(i)
    return res
```

## Worked example — Daily Temperatures
Same pattern; the answer is the **distance** to the warmer day, so store indices.
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
 "next GREATER" / "warmer"   -> keep a DECREASING stack (pop when bigger arrives)
 "next SMALLER"              -> keep an INCREASING stack (pop when smaller arrives)
```
Store **indices** (not just values) when you need distances or to fill a result array.

## Complexity
**O(n)** time (each index pushed/popped once), O(n) space.

## Canonical problems
| Problem | Stack direction |
|---|---|
| Next Greater Element I / II | decreasing |
| Daily Temperatures | decreasing (indices) |
| Online Stock Span | decreasing |
| Largest Rectangle in Histogram | increasing (see [[stack-03-problems]]) |
| Trapping Rain Water | stack or two pointers ([[arrays-12-advanced]]) |

## Gotchas
- Decide **increasing vs decreasing** before coding, and be consistent.
- Store **indices** when you need the gap/position, not just the value.
- "Next greater with wrap-around" (circular): iterate `2n` times, index with `i % n`.

## Next
- [[stack-03-problems]] — RPN, histogram, path/decode, recursion→stack

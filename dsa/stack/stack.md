---
title: Stack
phase: 2
tags: [dsa, stack, monotonic-stack]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
- **Matching / nesting**: parentheses, tags, undo — "the most recent unmatched thing"
- **"Next greater / smaller element"**, "days until warmer" → **monotonic stack**
- Evaluating expressions (RPN), simplifying paths
- Turning recursion into iteration (an explicit stack)

A stack is **LIFO** — last in, first out. In Python a plain `list` is your stack:
`push = append`, `pop = pop()`, `peek = stack[-1]`.

## The idea
```
 push 1,2,3 then pop:
   push        pop -> 3
  ┌───┐        ┌───┐
  │ 3 │ <- top │ 2 │ <- top now
  │ 2 │        │ 1 │
  │ 1 │        └───┘
  └───┘
```

## Template — valid parentheses (matching)
Push openers; on a closer, the top must be its match.
```python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs:                      # a closer
            if not stack or stack.pop() != pairs[c]:
                return False
        else:                               # an opener
            stack.append(c)
    return not stack                        # all matched?
```

## Template — monotonic stack ("next greater element")
Keep the stack **decreasing**; when a bigger value arrives, it resolves everything
smaller below it. Each index is pushed/popped once → **O(n)**.
```
 nums = [2, 1, 2, 4]   next greater:
 stack holds indices with no greater element yet
 4 arrives -> pops 2,1,2 (their next-greater is 4)
```
```python
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []                       # indices, values decreasing
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            res[stack.pop()] = x
        stack.append(i)
    return res
```

## Complexity
- Push / pop / peek: **O(1)**.
- Monotonic-stack scans: **O(n)** total (amortized — each element in/out once).

## Canonical problems (NeetCode)
| Problem | Idea |
|---|---|
| Valid Parentheses | matching stack |
| Min Stack | stack of (val, running-min) |
| Evaluate Reverse Polish Notation | push operands, apply on operator |
| Daily Temperatures | monotonic (decreasing) stack of indices |
| Car Fleet | sort by position, stack of arrival times |
| Largest Rectangle in Histogram | monotonic increasing stack |
| Generate Parentheses | backtracking (see [[backtracking]]) |

## Gotchas / re-solve notes
- Check `if stack` before `pop()`/`peek()` — empty-stack errors are the #1 bug.
- Monotonic stack: decide **increasing vs decreasing** up front, and store **indices**
  (you usually need the distance, not just the value).
- Min Stack: store the running min alongside each value so `getMin` stays O(1).

## Related
- Monotonic stack also appears in [[arrays-12-advanced]] (trapping rain water, histogram)
- Iterative tree/graph traversals use an explicit stack → [[trees]], [[graphs]]

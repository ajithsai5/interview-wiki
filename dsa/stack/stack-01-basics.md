---
title: Stack 01 · Basics
phase: 2
tags: [dsa, stack, basics]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## LIFO — last in, first out
The last thing you push is the first thing you pop. In Python a plain `list` is a
stack: `append` = push, `pop()` = pop, `stack[-1]` = peek.
```
 push 1,2,3        pop -> 3, then 2, then 1
  ┌───┐ top
  │ 3 │
  │ 2 │
  │ 1 │
  └───┘
```
```python
stack = []
stack.append(1)          # push, O(1)
stack.append(2)
top = stack[-1]          # peek (2) -- check `if stack` first!
stack.pop()              # pop -> 2, O(1)
```

## Matching pattern — Valid Parentheses
Push openers; on a closer, the top must be its matching opener.
```python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs:                       # a closer
            if not stack or stack.pop() != pairs[c]:
                return False
        else:                                # an opener
            stack.append(c)
    return not stack                         # everything matched?
```

## Min Stack — O(1) getMin
Store the running minimum **alongside** each value, so the min is always available.
```python
class MinStack:
    def __init__(self): self.st = []        # (val, min_so_far)
    def push(self, x):
        m = x if not self.st else min(x, self.st[-1][1])
        self.st.append((x, m))
    def pop(self):   self.st.pop()
    def top(self):   return self.st[-1][0]
    def getMin(self):return self.st[-1][1]
```

## Complexity
push / pop / peek / getMin: all **O(1)**. Space O(n).

## Canonical problems
| Problem | Idea |
|---|---|
| Valid Parentheses | matching stack |
| Min Stack | pair each value with running min |
| Baseball Game / simple stack sims | push/pop by rule |

## Gotchas
- **Check `if stack` before `pop()`/`stack[-1]`** — empty-stack access is the top bug.
- For Min Stack, recomputing the min on pop is wrong/slow — store it per element.

## Next
- [[stack-02-monotonic]] — the monotonic-stack pattern

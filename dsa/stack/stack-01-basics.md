---
title: Stack 01 · Basics
phase: 2
tags: [dsa, stack, basics]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## LIFO — last in, first out
The last thing you push is the first thing you pop. In Python a plain `list` is a
stack: `append` = push, `pop()` = pop, `stack[-1]` = peek. (Use `collections.deque`
only if you also need fast pops from the *front* — that's a queue.)
```
 push 1, 2, 3        then pop, pop, pop
  ┌───┐ top              -> 3
  │ 3 │                  -> 2
  │ 2 │                  -> 1
  │ 1 │
  └───┘
```
```python
stack = []
stack.append(1)          # push, O(1)
stack.append(2)
top = stack[-1]          # peek (2) -- ALWAYS check `if stack` first!
stack.pop()              # pop -> 2, O(1)
len(stack)               # 1
```

## Why a stack? — "the most recent unmatched thing"
Whenever a problem cares about the *innermost* / *most recent* open item — brackets,
function calls, undo, "previous smaller", nested structures — a stack is the natural
fit because it surfaces exactly that item in O(1).

## Matching pattern — Valid Parentheses
Push openers; on a closer, the top must be its matching opener.

### Dry run on `"([])"`
```
 ( -> push        stack: [ (
 [ -> push        stack: [ ( [
 ] -> closer; pop '[' == match? yes      stack: [ (
 ) -> closer; pop '(' == match? yes      stack: [ ]   (empty)
 end: stack empty -> VALID
```
```python
def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in pairs:                       # a closer
            if not stack or stack.pop() != pairs[c]:
                return False                 # nothing to match, or wrong opener
        else:                                # an opener
            stack.append(c)
    return not stack                         # leftover openers => invalid
```

## Min Stack — O(1) getMin
Store the running minimum **alongside** each value, so the current min is always at the
top — no recomputation on pop.
```python
class MinStack:
    def __init__(self): self.st = []                 # list of (val, min_so_far)
    def push(self, x):
        m = x if not self.st else min(x, self.st[-1][1])
        self.st.append((x, m))
    def pop(self):    self.st.pop()
    def top(self):    return self.st[-1][0]
    def getMin(self): return self.st[-1][1]
```

## Stack as a "sequence reverser"
Pushing then popping reverses order — handy for reversing, or processing tokens
right-to-left.

## Complexity
push / pop / peek / getMin: all **O(1)**. Space O(n) for the stack contents.

## Canonical problems
| Problem | Approach |
|---|---|
| Valid Parentheses | push openers, match on closers |
| Min Stack | pair each value with running min |
| Implement Queue using Stacks | two stacks (in + out) |
| Baseball Game | push/pop by simple rules |
| Backspace String Compare | build with a stack, or two pointers from the end |

## Variations & follow-ups
- "Longest Valid Parentheses" → stack of **indices**, or DP.
- Multiple bracket types vs one type → the `pairs` map generalizes both.
- "Remove Adjacent Duplicates" → push; if top equals current, pop instead.

## Gotchas
- **Check `if stack` before `pop()`/`stack[-1]`** — empty-stack access is the top bug.
- For Min Stack, recomputing the min on pop is O(n) and wrong-headed — store it per element.
- A leftover non-empty stack at the end usually means **unmatched** items.

## Next
- [[stack-02-monotonic]] — the monotonic-stack pattern

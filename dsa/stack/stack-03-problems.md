---
title: Stack 03 · Classic Problems
phase: 2
tags: [dsa, stack]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Evaluate Reverse Polish Notation
Push numbers; on an operator, pop two, apply, push the result. RPN needs no parentheses
because the order is unambiguous.
```
 ["2","1","+","3","*"]   ->  (2+1)*3 = 9
 2 -> [2]   1 -> [2,1]   + -> pop 1,2 push 3 -> [3]   3 -> [3,3]   * -> [9]
```
```python
def eval_rpn(tokens):
    stack, ops = [], {"+", "-", "*", "/"}
    for t in tokens:
        if t in ops:
            b, a = stack.pop(), stack.pop()           # order matters for - and /
            stack.append(int(a + b) if t == "+" else
                         int(a - b) if t == "-" else
                         int(a * b) if t == "*" else int(a / b))  # truncate toward 0
        else:
            stack.append(int(t))
    return stack[-1]
```

## Largest Rectangle in Histogram (monotonic increasing)
Keep indices with **increasing** heights. When a shorter bar appears, pop and compute
the area each popped bar can span — its height × the width now open to it.

### Why width = `i - stack[-1] - 1`
When you pop bar `h`, the new top is the nearest **shorter** bar on the left, and `i`
is the nearest shorter bar on the right, so `h` can stretch strictly between them.
```
 heights = [2,1,5,6,2,3]   the 5,6 block pops at the 2 -> rect 5*2 and 6*1, best 10
```
```python
def largest_rectangle(heights):
    stack = []                       # indices, heights increasing
    best = 0
    for i, h in enumerate(heights + [0]):     # sentinel 0 flushes the stack at the end
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    return best
```

## Decode String — nested "k[...]" with a stack
Push the (count, prefix) context on `[`; on `]`, pop and repeat.
```python
def decode_string(s):
    stack, cur, num = [], "", 0
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c == "[":
            stack.append((cur, num)); cur, num = "", 0
        elif c == "]":
            prev, k = stack.pop(); cur = prev + cur * k
        else:
            cur += c
    return cur          # "3[a2[c]]" -> "accaccacc"
```

## Simplify Path — "innermost / latest" with a stack
```python
def simplify_path(path):
    stack = []
    for part in path.split("/"):
        if part in ("", "."):
            continue
        if part == "..":
            if stack: stack.pop()        # go up one directory
        else:
            stack.append(part)
    return "/" + "/".join(stack)
```

## Recursion → iteration with an explicit stack
Any recursion can be made iterative by pushing frames yourself — essential when
recursion depth would overflow (deep trees/graphs).
```python
def inorder(root):                       # iterative in-order traversal
    res, stack, node = [], [], root
    while node or stack:
        while node:                      # dive left, stacking nodes
            stack.append(node); node = node.left
        node = stack.pop()
        res.append(node.val)             # visit
        node = node.right                # then go right
    return res
```

## Canonical problems
| Problem | Approach |
|---|---|
| Evaluate Reverse Polish Notation | operand stack |
| Largest Rectangle in Histogram | monotonic increasing + sentinel |
| Maximal Rectangle (2-D) | row-by-row histogram |
| Decode String | stack of (prefix, count) |
| Simplify Path | stack of directory names |
| Basic Calculator I/II | stack for signs/parentheses or running eval |
| Min Stack | value + running-min ([[stack-01-basics]]) |

## Variations & follow-ups
- Histogram → **Maximal Rectangle** in a binary matrix is "histogram per row".
- Calculator with `+ - * /` and parentheses → handle precedence with a number stack +
  operator handling, or recursion on `(`.
- "Asteroid Collision" / "Remove K Digits" are monotonic-stack greedy variants.

## Gotchas
- Histogram: the **sentinel `0`** at the end flushes bars still on the stack; width math
  uses the new top after popping.
- RPN division truncates **toward zero** (`int(a / b)`), not floor — matters for negatives.
- For nested structures, reach for a stack before clever string parsing.

## Related
- Builds on [[stack-02-monotonic]]; iterative traversals serve [[trees-00-roadmap]] / [[graphs-00-roadmap]]
- Back to [[stack-00-roadmap]]

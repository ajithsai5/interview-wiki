---
title: Stack 03 · Classic Problems
phase: 2
tags: [dsa, stack]
group: Stack
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Evaluate Reverse Polish Notation
Push numbers; on an operator, pop two, apply, push the result.
```python
def eval_rpn(tokens):
    stack, ops = [], {"+", "-", "*", "/"}
    for t in tokens:
        if t in ops:
            b, a = stack.pop(), stack.pop()
            stack.append(int(a + b) if t == "+" else
                         int(a - b) if t == "-" else
                         int(a * b) if t == "*" else int(a / b))  # trunc toward 0
        else:
            stack.append(int(t))
    return stack[-1]
```

## Largest Rectangle in Histogram (monotonic increasing)
Keep indices with **increasing** heights. When a shorter bar appears, pop and compute
the area each popped bar can span (its height × the width now available).
```python
def largest_rectangle(heights):
    stack = []                       # indices, heights increasing
    best = 0
    for i, h in enumerate(heights + [0]):     # sentinel 0 flushes the stack
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    return best
```

## Simplify Path / Decode String — "innermost first"
A stack naturally handles nesting: push context, pop to resolve the innermost.
```python
def simplify_path(path):
    stack = []
    for part in path.split("/"):
        if part == "" or part == ".":
            continue
        if part == "..":
            if stack: stack.pop()        # go up one dir
        else:
            stack.append(part)
    return "/" + "/".join(stack)
```

## Recursion → iteration with an explicit stack
Any recursion can be made iterative by pushing the "to-do" frames yourself — useful
when recursion depth would overflow (deep trees/graphs).
```python
def inorder(root):                       # iterative in-order traversal
    res, stack, node = [], [], root
    while node or stack:
        while node:
            stack.append(node); node = node.left
        node = stack.pop()
        res.append(node.val)
        node = node.right
    return res
```

## Canonical problems
| Problem | Idea |
|---|---|
| Evaluate Reverse Polish Notation | operand stack |
| Largest Rectangle in Histogram | monotonic increasing |
| Generate Parentheses | backtracking ([[backtracking-00-roadmap]]) |
| Decode String | stack of (count, prefix) |
| Simplify Path | stack of directory names |
| Basic Calculator | stack for signs / parentheses |

## Gotchas
- Histogram: the **sentinel `0`** at the end flushes any bars still on the stack.
- RPN division truncates **toward zero** (`int(a / b)`), not floor.
- For "innermost first" / nesting, reach for a stack before clever string parsing.

## Related
- Builds on [[stack-02-monotonic]]; iterative traversals serve [[trees-00-roadmap]] / [[graphs-00-roadmap]]
- Back to [[stack-00-roadmap]]

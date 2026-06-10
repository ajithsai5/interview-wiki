---
title: Trees 01 · Basics
phase: 2
tags: [dsa, trees, basics, recursion]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Terminology
```
            1            <- root (no parent)
           / \
          2   3          2 and 3 are children of 1; 1 is their parent
         / \
        4   5            4, 5 are leaves (no children)
 depth(node)  = edges from the ROOT down to it      (root depth 0)
 height(node) = edges on the LONGEST path down to a leaf
 a tree with n nodes has n-1 edges
```
A **binary tree**: each node has up to two children (`left`, `right`).
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right
```

## The recursion mindset (this is 90% of tree problems)
"Do something with the node, using the answers from its children." Write the **base
case first** (empty subtree), then combine the children's results.
```python
def solve(node):
    if not node:                 # base case — empty subtree
        return BASE
    left  = solve(node.left)     # trust the recursion on children
    right = solve(node.right)
    return combine(node, left, right)
```
The three questions to answer for any tree-DFS:
1. **What does `solve(node)` return?** (one value, used by the parent)
2. **Base case?** (usually `None` → 0 / empty / True)
3. **How do I combine** `left`, `right`, and `node`?

## Worked examples
```python
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

def count_nodes(root):
    if not root: return 0
    return 1 + count_nodes(root.left) + count_nodes(root.right)

def sum_values(root):
    if not root: return 0
    return root.val + sum_values(root.left) + sum_values(root.right)

def same_tree(p, q):
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return same_tree(p.left, q.left) and same_tree(p.right, q.right)
```

## Complexity
- Visiting every node once: **O(n)** time.
- Space = recursion depth = **O(h)** (tree height). Balanced ≈ O(log n); a degenerate
  "linked-list" tree is O(n) — deep recursion can overflow the stack.

## Variations & follow-ups
- "Invert/mirror a tree" → swap children, recurse.
- "Count leaves / full nodes / height-balanced?" → all the same combine-children shape.
- Iterative instead of recursive (avoid stack overflow) → explicit [[stack-00-roadmap|stack]] or BFS.

## Gotchas
- **Handle `if not node` first** — the empty base case prevents `None.left` crashes.
- Don't confuse **depth** (from root, top-down) with **height** (to deepest leaf, bottom-up).
- "Trust the recursion": assume `solve(child)` is correct, then just combine.

## Next
- [[trees-02-traversals]] — DFS orders and BFS

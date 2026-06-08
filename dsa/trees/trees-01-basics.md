---
title: Trees 01 · Basics
phase: 2
tags: [dsa, trees, basics, recursion]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Terminology
```
            1            <- root
           / \
          2   3          2 and 3 are children of 1; 1 is their parent
         / \
        4   5            4,5 are leaves (no children)
 depth(node)  = edges from the root down to it (root depth 0)
 height(node) = edges on the longest path down to a leaf
```
A **binary tree**: each node has up to two children (`left`, `right`).
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right
```

## The recursion mindset (this is 90% of tree problems)
"Do something with the node, using the answers from its children." Write the **base
case first** (empty subtree), then combine children.
```python
def solve(node):
    if not node:                 # base case
        return BASE
    left  = solve(node.left)     # trust recursion on children
    right = solve(node.right)
    return combine(node, left, right)
```

## Two starter examples
```python
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

def count_nodes(root):
    if not root: return 0
    return 1 + count_nodes(root.left) + count_nodes(root.right)
```

## Complexity
- Visiting every node once: **O(n)** time.
- Space = recursion depth = **O(h)** (tree height). Balanced ≈ O(log n); a degenerate
  "linked-list" tree is O(n).

## Gotchas
- **Handle `if not node` first** — the empty-subtree base case prevents `None.left` crashes.
- Don't confuse **depth** (from root) with **height** (to deepest leaf).
- "Trust the recursion": assume `solve(child)` is correct, then combine.

## Next
- [[trees-02-traversals]] — DFS orders and BFS

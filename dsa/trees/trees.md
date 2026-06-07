---
title: Trees
phase: 2
tags: [dsa, trees, bst, dfs, bfs, recursion]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
Trees are the **highest-frequency** interview topic. Almost everything is one of:
**DFS** (recursion — pre/in/post-order) or **BFS** (level-order with a queue),
plus the **BST property** (left < node < right) for ordered lookups.

```
        1
       / \
      2   3        node: { val, left, right }
     / \
    4   5
```
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val, self.left, self.right = val, left, right
```

## DFS — recursion is the whole game
Most tree problems are "do something with the node, then recurse on children."
```python
def dfs(node):
    if not node:                 # base case — empty subtree
        return ...
    left  = dfs(node.left)       # solve children
    right = dfs(node.right)
    return combine(node, left, right)   # use results

# max depth
def max_depth(root):
    if not root: return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
```
**Traversal orders** (when you "visit" the node relative to children):
```
 pre-order:  node, left, right     (copy a tree, prefix expr)
 in-order:   left, node, right     (BST -> sorted order!)
 post-order: left, right, node     (delete a tree, subtree sums, heights)
```

## BFS — level by level (queue)
```
 level 0: [1]
 level 1: [2, 3]
 level 2: [4, 5]
```
```python
from collections import deque
def level_order(root):
    if not root: return []
    q, out = deque([root]), []
    while q:
        level = []
        for _ in range(len(q)):          # fix the level size first
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        out.append(level)
    return out
```

## Binary Search Tree (BST)
`left subtree < node < right subtree`. Search/insert is **O(h)** (h = height;
O(log n) if balanced). **In-order traversal of a BST yields sorted values** — the
key trick for "kth smallest", "validate BST", "range sum".
```python
def search_bst(root, target):
    while root and root.val != target:
        root = root.left if target < root.val else root.right
    return root
```

## Complexity
- DFS/BFS visit each node once: **O(n)** time.
- Space: **O(h)** for DFS recursion (call stack), **O(n)** worst for BFS queue.
  Balanced h ≈ log n; a degenerate (linked-list-like) tree has h = n.

## Canonical problems (NeetCode)
| Problem | Idea |
|---|---|
| Invert Binary Tree | swap children, recurse |
| Maximum Depth | 1 + max(children) |
| Diameter of Binary Tree | post-order, track best left+right height |
| Balanced Binary Tree | post-order height + balance check |
| Same Tree / Subtree of Another Tree | parallel DFS |
| Level Order Traversal | BFS with queue |
| Validate BST | in-order is sorted, or pass (low, high) bounds |
| Kth Smallest in a BST | in-order, stop at k |
| Lowest Common Ancestor (BST) | walk down by value comparison |
| Construct Tree from Preorder+Inorder | recursion + index map |

## Gotchas / re-solve notes
- **Always handle `if not node`** (the empty base case) first.
- "Validate BST" needs **min/max bounds** passed down — checking only `left<node<right`
  locally is a classic wrong answer.
- BFS: snapshot `len(q)` **before** the inner loop to process exactly one level.
- Post-order is for "I need the children's results before deciding" (heights, sums).

## Related
- Tries are a specialized tree → see Backtracking/Graphs neighbors
- BFS/DFS generalize to [[graphs]]; "kth/closest" pairs with [[heap]]
- Tree DP (e.g. House Robber III) connects to [[dynamic-programming]]

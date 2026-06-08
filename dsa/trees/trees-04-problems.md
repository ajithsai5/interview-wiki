---
title: Trees 04 · Classic Problems
phase: 2
tags: [dsa, trees, dfs, dp]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## Return-value vs global pattern
Many tree problems need a node to return one thing **up** while updating a separate
**global** best. Diameter is the archetype: each node returns its *height*, but updates
a global *longest path through me*.
```python
def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        if not node: return 0
        l, r = height(node.left), height(node.right)
        best = max(best, l + r)        # path through this node (in edges)
        return 1 + max(l, r)           # height returned upward
    height(root)
    return best
```

## Balanced check (post-order, short-circuit)
```python
def is_balanced(root):
    def h(node):
        if not node: return 0
        l = h(node.left)
        if l == -1: return -1
        r = h(node.right)
        if r == -1 or abs(l - r) > 1: return -1   # -1 signals "unbalanced"
        return 1 + max(l, r)
    return h(root) != -1
```

## Lowest Common Ancestor (general binary tree)
Recurse; if a node sees `p` in one subtree and `q` in the other (or is one of them),
it's the LCA.
```python
def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    left  = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right: return root      # split point
    return left or right
```

## Construct from Preorder + Inorder
Pre-order's first element is the root; its position in in-order splits left/right
subtrees. Use an index map for O(n).
```python
def build_tree(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}
    self_pre = iter(preorder)
    def go(lo, hi):
        if lo > hi: return None
        val = next(self_pre)
        node = TreeNode(val)
        mid = idx[val]
        node.left  = go(lo, mid - 1)
        node.right = go(mid + 1, hi)
        return node
    return go(0, len(inorder) - 1)
```

## Serialize / deserialize (BFS or pre-order with null markers)
Record nulls so structure is recoverable; pre-order DFS with `#` for None is simplest.

## Tree DP — House Robber III
Each node returns `(rob_this, skip_this)`; combine children's choices. Same idea as
[[arrays-13-dp|1-D DP]] but on a tree.

## Canonical problems
| Problem | Idea |
|---|---|
| Invert Binary Tree | swap children, recurse |
| Diameter of Binary Tree | height + global best |
| Balanced Binary Tree | post-order, -1 sentinel |
| Lowest Common Ancestor | split-point recursion |
| Construct from Preorder & Inorder | root + index map |
| Serialize and Deserialize | pre-order/BFS with null markers |
| Binary Tree Maximum Path Sum | diameter-style, drop negatives |
| House Robber III | tree DP (rob/skip per node) |

## Gotchas
- The **return-up vs global-best** split is the key insight for diameter/max-path-sum.
- "Max path sum": clamp negative child contributions to 0.
- Construct: build an **index map** of in-order to avoid O(n²) searches.

## Related
- Tree DP → [[arrays-13-dp]]; traversals → [[trees-02-traversals]]; generalizes to [[graphs-00-roadmap]]
- Back to [[trees-00-roadmap]]

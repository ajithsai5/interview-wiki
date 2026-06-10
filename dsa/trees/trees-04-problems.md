---
title: Trees 04 · Classic Problems
phase: 2
tags: [dsa, trees, dfs, dp]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## The "return-value vs global-best" pattern
Many tree problems need a node to return one thing **up** while updating a separate
**global** best. This is the single most important advanced tree idea.

**Diameter** is the archetype: each node returns its *height*, but updates a global
*longest path through me* = `leftHeight + rightHeight`.
```python
def diameter(root):
    best = 0
    def height(node):
        nonlocal best
        if not node: return 0
        l, r = height(node.left), height(node.right)
        best = max(best, l + r)        # path THROUGH this node (in edges)
        return 1 + max(l, r)           # height returned UPWARD
    height(root)
    return best
```
**Binary Tree Maximum Path Sum** is the same shape — return the best one-sided gain,
update a global best with `node.val + leftGain + rightGain`, and clamp negative gains to 0.

## Balanced check (post-order, short-circuit with a sentinel)
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
Recurse; if a node finds `p` in one subtree and `q` in the other (or *is* one of them),
it's the LCA.
```python
def lca(root, p, q):
    if not root or root is p or root is q:
        return root
    left  = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right: return root      # found one on each side -> split point
    return left or right                # bubble up whichever was found
```

## Construct from Preorder + Inorder
Pre-order's first element is the root; its position in in-order splits left/right
subtrees. An index map makes it O(n).
```python
def build_tree(preorder, inorder):
    idx = {v: i for i, v in enumerate(inorder)}
    it = iter(preorder)
    def go(lo, hi):
        if lo > hi: return None
        val = next(it)                  # next root in pre-order
        node = TreeNode(val)
        mid = idx[val]
        node.left  = go(lo, mid - 1)    # build left before right (pre-order!)
        node.right = go(mid + 1, hi)
        return node
    return go(0, len(inorder) - 1)
```

## Serialize / deserialize
Record nulls so structure is recoverable. Pre-order DFS with `#` for `None` is simplest:
```python
def serialize(root):
    out = []
    def go(n):
        if not n: out.append("#"); return
        out.append(str(n.val)); go(n.left); go(n.right)
    go(root); return ",".join(out)

def deserialize(data):
    vals = iter(data.split(","))
    def go():
        v = next(vals)
        if v == "#": return None
        n = TreeNode(int(v)); n.left = go(); n.right = go()
        return n
    return go()
```

## Tree DP — House Robber III
Each node returns `(rob_this, skip_this)`; the parent combines children's choices. Same
idea as [[arrays-13-dp|1-D DP]], but on a tree.
```python
def rob(root):
    def go(node):                       # returns (rob_node, skip_node)
        if not node: return (0, 0)
        lr, ls = go(node.left)
        rr, rs = go(node.right)
        rob_node  = node.val + ls + rs          # rob node -> must skip children
        skip_node = max(lr, ls) + max(rr, rs)   # skip node -> children free to choose
        return (rob_node, skip_node)
    return max(go(root))
```

## Canonical problems
| Problem | Approach |
|---|---|
| Invert Binary Tree | swap children, recurse |
| Diameter of Binary Tree | height + global best |
| Binary Tree Maximum Path Sum | one-sided gain + global best, clamp negatives |
| Balanced Binary Tree | post-order, -1 sentinel |
| Lowest Common Ancestor | split-point recursion |
| Construct from Preorder & Inorder | root + index map |
| Serialize and Deserialize | pre-order/BFS with null markers |
| House Robber III | tree DP (rob/skip per node) |

## Variations & follow-ups
- "LCA with parent pointers" → walk up both to equal depth, then together.
- "Count Good Nodes" → DFS carrying the max-on-path-so-far.
- "Path Sum III" (count downward paths = target) → prefix-sum + hashmap on the path.

## Gotchas
- The **return-up vs global-best** split is the key insight for diameter / max-path-sum.
- Max path sum: **clamp negative child gains to 0** (don't take a harmful branch).
- Construct: build an **index map** of in-order to avoid O(n²) searches.

## Related
- Tree DP → [[arrays-13-dp]]; traversals → [[trees-02-traversals]]; generalizes to [[graphs-00-roadmap]]
- Back to [[trees-00-roadmap]]

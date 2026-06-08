---
title: Trees 02 · Traversals (DFS & BFS)
phase: 2
tags: [dsa, trees, dfs, bfs]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## DFS — three orders (when you "visit" vs recurse)
```
        1
       / \
      2   3
     / \
    4   5
 pre-order  (node,left,right): 1 2 4 5 3     -> copy tree, prefix expr
 in-order   (left,node,right): 4 2 5 1 3     -> BST gives SORTED order
 post-order (left,right,node): 4 5 2 3 1     -> heights, subtree sums, delete
```
```python
def inorder(root, out):
    if not root: return
    inorder(root.left, out)
    out.append(root.val)        # visit between children
    inorder(root.right, out)
```
- **post-order** when you need children's results *before* deciding the node (heights, "is balanced", subtree sums).
- **in-order** for BSTs (yields sorted values).

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
        for _ in range(len(q)):           # snapshot the level size FIRST
            node = q.popleft()
            level.append(node.val)
            if node.left:  q.append(node.left)
            if node.right: q.append(node.right)
        out.append(level)
    return out
```

## Iterative DFS (avoid recursion-depth limits)
```python
def preorder_iter(root):
    res, stack = [], [root] if root else []
    while stack:
        node = stack.pop()
        res.append(node.val)
        if node.right: stack.append(node.right)   # push right first
        if node.left:  stack.append(node.left)    # so left is processed first
    return res
```

## Complexity
All traversals: **O(n)** time. Space: DFS O(h) recursion stack; BFS O(n) queue (worst).

## Canonical problems
| Problem | Order |
|---|---|
| Binary Tree Inorder/Preorder/Postorder | DFS |
| Level Order Traversal / Zigzag | BFS |
| Right Side View | BFS (last per level) |
| Maximum Depth / Min Depth | DFS or BFS |
| Binary Tree Paths | DFS carrying the path |

## Gotchas
- BFS: **snapshot `len(q)`** before the inner loop to process exactly one level.
- Iterative pre-order: push **right before left** so left comes off first.
- Pick the order by *when you need the node's data* relative to its children.

## Next
- [[trees-03-bst]] — binary search trees

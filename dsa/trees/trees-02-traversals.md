---
title: Trees 02 · Traversals (DFS & BFS)
phase: 2
tags: [dsa, trees, dfs, bfs]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## DFS — three orders (when you "visit" vs recurse)
```
        1
       / \
      2   3
     / \
    4   5
 pre-order  (node,left,right): 1 2 4 5 3     -> copy a tree, prefix expression
 in-order   (left,node,right): 4 2 5 1 3     -> a BST yields SORTED order
 post-order (left,right,node): 4 5 2 3 1     -> heights, subtree sums, deletion
```
```python
def preorder(root, out):
    if not root: return
    out.append(root.val)        # visit BEFORE children
    preorder(root.left, out)
    preorder(root.right, out)

def inorder(root, out):
    if not root: return
    inorder(root.left, out)
    out.append(root.val)        # visit BETWEEN children
    inorder(root.right, out)

def postorder(root, out):
    if not root: return
    postorder(root.left, out)
    postorder(root.right, out)
    out.append(root.val)        # visit AFTER children
```
- **post-order** when you need children's results *before* deciding the node
  (heights, "is balanced", subtree sums, deleting).
- **in-order** for BSTs (yields sorted values).
- **pre-order** to serialize / copy top-down.

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
The `for _ in range(len(q))` is the trick that processes **exactly one level** per
outer iteration.

## Iterative DFS (avoid recursion-depth limits)
```python
def preorder_iter(root):
    res, stack = [], [root] if root else []
    while stack:
        node = stack.pop()
        res.append(node.val)
        if node.right: stack.append(node.right)   # push right first...
        if node.left:  stack.append(node.left)    # ...so left comes off first
    return res
```

## Complexity
All traversals: **O(n)** time. Space: DFS O(h) recursion stack; BFS O(n) queue (a full
bottom level can hold ~n/2 nodes).

## Canonical problems
| Problem | Order / tool | Approach |
|---|---|---|
| Inorder / Preorder / Postorder | DFS | recursion or explicit stack |
| Level Order / Zigzag | BFS | per-level loop; reverse alternate levels |
| Right Side View | BFS | last node of each level |
| Average of Levels | BFS | sum/count per level |
| Maximum / Minimum Depth | DFS or BFS | BFS min-depth stops at first leaf |
| Binary Tree Paths | DFS | carry the path, record at leaves |

## Variations & follow-ups
- "Vertical order traversal" → BFS carrying a column index, bucket by column.
- "Boundary of binary tree" → left edge + leaves + reversed right edge.
- Morris traversal does in-order in **O(1) space** (advanced; threads the tree).

## Gotchas
- BFS: **snapshot `len(q)`** before the inner loop, or you mix levels together.
- Iterative pre-order: push **right before left** so left is processed first.
- Pick the order by *when you need the node's data* relative to its children.

## Next
- [[trees-03-bst]] — binary search trees

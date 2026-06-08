---
title: Trees 03 · Binary Search Trees
phase: 2
tags: [dsa, trees, bst, binary-search]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## The BST property
For **every** node: all values in the **left** subtree are smaller, all in the
**right** subtree are larger.
```
        5
       / \
      3   8        left(3,1,4) < 5 < right(8,...)
     / \
    1   4
```
This makes search/insert **O(h)** — you discard half the tree at each step (O(log n)
if balanced).

## Search & insert
```python
def search(root, target):
    while root and root.val != target:
        root = root.left if target < root.val else root.right
    return root

def insert(root, val):
    if not root: return TreeNode(val)
    if val < root.val: root.left  = insert(root.left, val)
    else:              root.right = insert(root.right, val)
    return root
```

## The killer trick: in-order traversal of a BST is SORTED
So "kth smallest", "validate BST", "range sum", "two-sum in BST" all use in-order.
```python
def kth_smallest(root, k):
    stack, node = [], root
    while node or stack:
        while node:
            stack.append(node); node = node.left
        node = stack.pop()
        k -= 1
        if k == 0: return node.val      # kth in sorted order
        node = node.right
```

## Validate a BST — pass bounds down (not just local checks!)
Checking only `left < node < right` locally is a classic wrong answer. Carry the
allowed `(low, high)` range as you descend.
```python
def is_valid_bst(root, low=float('-inf'), high=float('inf')):
    if not root: return True
    if not (low < root.val < high): return False
    return (is_valid_bst(root.left,  low, root.val) and
            is_valid_bst(root.right, root.val, high))
```

## Lowest Common Ancestor in a BST (use the ordering)
Walk down: if both targets are smaller, go left; both larger, go right; otherwise
this node is the split point = the LCA.
```python
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val: root = root.left
        elif p.val > root.val and q.val > root.val: root = root.right
        else: return root
```

## Complexity
Search/insert/LCA: **O(h)** — O(log n) balanced, O(n) degenerate. In-order: O(n).

## Canonical problems
| Problem | Idea |
|---|---|
| Validate Binary Search Tree | bounds passed down |
| Kth Smallest Element in a BST | in-order, stop at k |
| Lowest Common Ancestor of a BST | walk by value comparison |
| Insert / Delete / Search in a BST | O(h) navigation |
| Convert Sorted Array to BST | pick middle as root, recurse |

## Gotchas
- **Validate with min/max bounds**, not local comparisons.
- A BST only stays O(log n) if **balanced**; worst case (sorted inserts) is O(n).
- In-order = sorted is the single most useful BST fact.

## Next
- [[trees-04-problems]] — diameter, balanced, LCA, construct, serialize, tree-DP

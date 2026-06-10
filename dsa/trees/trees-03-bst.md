---
title: Trees 03 · Binary Search Trees
phase: 2
tags: [dsa, trees, bst, binary-search]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## The BST property
For **every** node: all values in the **left** subtree are smaller, all in the **right**
subtree are larger.
```
        5
       / \
      3   8        every left < node < every right (the WHOLE subtree, not just kids)
     / \
    1   4
```
This makes search/insert **O(h)** — you discard half the tree at each step (O(log n) if
balanced, O(n) if degenerate).

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
So "kth smallest", "validate BST", "range sum", "two-sum in BST", "convert to sorted
list" all use in-order.
```python
def kth_smallest(root, k):
    stack, node = [], root
    while node or stack:
        while node:
            stack.append(node); node = node.left
        node = stack.pop()
        k -= 1
        if k == 0: return node.val      # kth value in sorted order
        node = node.right
```

## Validate a BST — pass bounds down (not just local checks!)
Checking only `left.val < node.val < right.val` locally is a classic **wrong answer** —
a deep descendant can still violate the property. Carry the allowed `(low, high)` range.
```
 wrong: node 5 with left 3, right 8 looks fine locally,
        but if 8's LEFT child is 4 (< 5), it's invalid -> bounds catch it
```
```python
def is_valid_bst(root, low=float('-inf'), high=float('inf')):
    if not root: return True
    if not (low < root.val < high): return False
    return (is_valid_bst(root.left,  low, root.val) and
            is_valid_bst(root.right, root.val, high))
```

## Lowest Common Ancestor in a BST (use the ordering)
Walk down: both targets smaller → go left; both larger → go right; otherwise this node
is the split point = the LCA.
```python
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val: root = root.left
        elif p.val > root.val and q.val > root.val: root = root.right
        else: return root              # split (or one equals root)
```

## Delete a node (the tricky one)
Three cases: leaf → remove; one child → splice it up; two children → replace with the
**in-order successor** (smallest in the right subtree), then delete that.
```python
def delete(root, key):
    if not root: return None
    if key < root.val:   root.left  = delete(root.left, key)
    elif key > root.val: root.right = delete(root.right, key)
    else:
        if not root.left:  return root.right
        if not root.right: return root.left
        succ = root.right                       # in-order successor
        while succ.left: succ = succ.left
        root.val = succ.val
        root.right = delete(root.right, succ.val)
    return root
```

## Complexity
Search / insert / delete / LCA: **O(h)** — O(log n) balanced, O(n) degenerate. In-order
walk: O(n).

## Canonical problems
| Problem | Approach |
|---|---|
| Validate Binary Search Tree | bounds passed down |
| Kth Smallest Element in a BST | in-order, stop at k |
| Lowest Common Ancestor of a BST | walk by value comparison |
| Insert / Delete / Search in a BST | O(h) navigation |
| Convert Sorted Array to BST | middle = root, recurse halves (balanced) |
| Range Sum of BST | in-order / pruned DFS within [low, high] |

## Variations & follow-ups
- "Two Sum in a BST" → in-order to a sorted list + two pointers, or a hashset DFS.
- "BST Iterator" → controlled in-order using an explicit stack (next/hasNext).
- Keeping a BST **balanced** (AVL / red-black) is rarely asked to implement, but know it
  guarantees O(log n).

## Gotchas
- **Validate with min/max bounds**, not local comparisons.
- A BST stays O(log n) only if **balanced**; sorted inserts make it O(n) (a line).
- "In-order = sorted" is the single most useful BST fact — reach for it first.

## Next
- [[trees-04-problems]] — diameter, balanced, LCA, construct, serialize, tree-DP

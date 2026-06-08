---
title: Trees 00 · Roadmap
phase: 2
tags: [dsa, trees, roadmap, index]
group: Trees
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## What this track is
Trees are the **highest-frequency** interview topic. Almost everything reduces to
**DFS** (recursion) or **BFS** (level-order), plus the **BST** ordering property.

## The path
1. [[trees-01-basics]] — terminology, the node, height/depth, recursion mindset
2. [[trees-02-traversals]] — DFS (pre/in/post) + BFS (level order)
3. [[trees-03-bst]] — binary search trees: search, insert, the in-order trick
4. [[trees-04-problems]] — depth, diameter, balanced, LCA, construct, serialize, tree-DP

## Pattern → reach-for-it
| Clue | Use |
|---|---|
| "depth / height / count / sum" | DFS post-order — [[trees-02-traversals]] |
| "level by level", "shortest in tree" | BFS — [[trees-02-traversals]] |
| "sorted order", "kth smallest", "validate" | BST in-order — [[trees-03-bst]] |
| "lowest common ancestor", "path" | DFS returning info up — [[trees-04-problems]] |

## Related
- BFS/DFS generalize to [[graphs-00-roadmap|graphs]]; "kth/closest" pairs with a [[heap-00-roadmap|heap]]; tree-DP connects to [[arrays-13-dp|DP]]

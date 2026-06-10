---
title: Graphs 03 · Topological Sort & Union-Find
phase: 2
tags: [dsa, graphs, topological-sort, union-find]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-10
---

## Topological sort — ordering with dependencies
On a directed acyclic graph, order nodes so every edge points forward ("take A before
B"). **Kahn's algorithm** (BFS on in-degrees) also **detects cycles** — if you can't
output all nodes, there's a cycle.
```
 edges a->b means "a before b"
 repeatedly take a node with in-degree 0, remove it, decrement neighbors
```
```python
from collections import deque, defaultdict
def topo_order(n, edges):               # edges: [a, b]  (a -> b)
    adj = defaultdict(list); indeg = [0] * n
    for a, b in edges:
        adj[a].append(b); indeg[b] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft(); order.append(node)
        for nxt in adj[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0:
                q.append(nxt)
    return order if len(order) == n else []   # [] => a cycle exists
```
**Course Schedule** = "is there a valid order?" → return `len(order) == n`.

## Dry run — courses 0..3, prereqs 0→1, 0→2, 1→3, 2→3
```
 indeg: 0:0  1:1  2:1  3:2
 q starts with in-degree-0 nodes: [0]
 pop 0 -> order=[0]; dec 1->0, 2->0 -> q=[1,2]
 pop 1 -> order=[0,1]; dec 3->1
 pop 2 -> order=[0,1,2]; dec 3->0 -> q=[3]
 pop 3 -> order=[0,1,2,3]
 len==4 -> valid order. (If a cycle existed, some node never hits in-degree 0.)
```

## Union-Find (Disjoint Set Union) — fast connectivity
Group elements into sets; `find` returns a set's representative, `union` merges two.
With path compression it's ~O(1) per operation. Great for "are these connected?",
"number of components", and cycle detection in *undirected* graphs.
```python
class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.rank = [0] * n
    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]    # path compression
            x = self.p[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False                     # already together -> cycle/edge redundant
        if self.rank[ra] < self.rank[rb]: ra, rb = rb, ra
        self.p[rb] = ra
        if self.rank[ra] == self.rank[rb]: self.rank[ra] += 1
        return True
```

## Dry run — DSU detects a redundant edge
```
 edges: (0,1), (1,2), (0,2)   start: each node its own parent
 union(0,1): roots 0,1 differ -> merge -> {0,1}
 union(1,2): roots find(1)=0, find(2)=2 differ -> merge -> {0,1,2}
 union(0,2): find(0)=0, find(2)=0 SAME -> returns False
             -> (0,2) is the redundant edge that closes a cycle
```
The two optimizations: **path compression** (flatten the tree during `find`) and **union
by rank** (attach the shorter tree under the taller). Together they give near-O(1) ops.

## When to pick which
```
 "valid build/learning order", "course prerequisites"  -> topological sort
 "are these in the same group?", "count components",
   "redundant connection / cycle in undirected graph"  -> union-find
```

## Complexity
Topo sort: **O(V + E)**. Union-Find: ~**O(α(n)) ≈ O(1)** amortized per op (α = inverse
Ackermann, effectively a small constant).

## Canonical problems
| Problem | Approach |
|---|---|
| Course Schedule I / II | Kahn's topo sort (cycle check / output order) |
| Alien Dictionary | derive edges from adjacent words, then topo sort |
| Number of Connected Components | union every edge, count distinct roots |
| Redundant Connection | union-find: first edge joining an already-joined pair |
| Graph Valid Tree | union-find: exactly n−1 edges, all connected, no cycle |
| Accounts Merge / Number of Provinces | union-find grouping |

## Variations & follow-ups
- "Course Schedule II" → return the actual `order` (not just the boolean).
- "Alien Dictionary" → compare adjacent words char by char to get the first differing
  pair = one edge; then topo sort the alphabet.
- "Number of Provinces" / "Accounts Merge" → union members, then bucket by `find` root.
- Topo sort can also be done with **DFS** (push to a stack on the way out, reverse) — Kahn's
  is just easier to also get cycle detection from.

## Gotchas
- Topo sort only works on a **DAG**; a leftover (order shorter than n) means a cycle.
- Union-Find without path compression degrades — keep the compression line.
- For directed-graph cycle detection, prefer topo sort / DFS colors (union-find is for
  **undirected** graphs).

## Next
- [[graphs-04-shortest-path]] — Dijkstra (weighted)

---
title: Graphs 03 · Topological Sort & Union-Find
phase: 2
tags: [dsa, graphs, topological-sort, union-find]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
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

## When to pick which
```
 "valid build/learning order", "course prerequisites"  -> topological sort
 "are these in the same group?", "count components",
   "redundant connection / cycle in undirected graph"  -> union-find
```

## Complexity
Topo sort: **O(V + E)**. Union-Find: ~**O(α(n)) ≈ O(1)** amortized per op.

## Canonical problems
| Problem | Tool |
|---|---|
| Course Schedule I / II | topo sort (cycle check / order) |
| Alien Dictionary | build graph + topo sort |
| Number of Connected Components | union-find (or DFS) |
| Redundant Connection | union-find (first edge that joins same set) |
| Graph Valid Tree | union-find: n-1 edges, all connected, no cycle |

## Gotchas
- Topo sort only works on a **DAG**; a leftover (order shorter than n) means a cycle.
- Union-Find without path compression degrades — keep the compression line.
- For directed-graph cycle detection, prefer topo sort / DFS colors (union-find is for
  undirected).

## Next
- [[graphs-04-shortest-path]] — Dijkstra (weighted)

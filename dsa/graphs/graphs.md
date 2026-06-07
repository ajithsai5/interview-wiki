---
title: Graphs
phase: 2
tags: [dsa, graphs, bfs, dfs, topological-sort, union-find]
group: Graphs
status: new
anki: false
created: 2026-06-06
updated: 2026-06-06
---

## When to reach for it
Anything about **connections**: shortest path, "are these connected?", grids
(islands/rooms), course prerequisites, networks. The toolkit: **BFS** (shortest
path in *unweighted* graphs), **DFS** (reachability, components, cycles),
**topological sort** (ordering with dependencies), **union-find** (connectivity),
and **Dijkstra** (shortest path with weights).

```
 graph as an adjacency list:
   A — B        adj = {A:[B,C], B:[A,D], C:[A,D], D:[B,C]}
   |   |
   C — D
 Grids are graphs too: each cell connects to up/down/left/right.
```

## DFS & BFS (memorize both)
```python
from collections import deque

def dfs(node, adj, seen):
    seen.add(node)
    for nxt in adj[node]:
        if nxt not in seen:
            dfs(nxt, adj, seen)

def bfs(start, adj):
    seen = {start}
    q = deque([start])
    while q:
        node = q.popleft()
        for nxt in adj[node]:
            if nxt not in seen:
                seen.add(nxt)         # mark on ENQUEUE, not dequeue
                q.append(nxt)
```
**Always track `seen`** — without it you loop forever on cycles. **BFS = shortest
path** (fewest edges) in an unweighted graph; DFS does not guarantee shortest.

## Grid pattern (islands, rooms, flood fill)
```python
def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    def sink(r, c):
        if 0 <= r < rows and 0 <= c < cols and grid[r][c] == "1":
            grid[r][c] = "0"                    # mark visited
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                sink(r+dr, c+dc)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1; sink(r, c)
    return count
```

## Topological sort (dependencies / ordering)
For a DAG: order nodes so every edge points forward. **Kahn's algorithm** (BFS on
in-degrees) also **detects cycles** (used in "Course Schedule").
```python
def topo_order(n, edges):                 # edges: [a, b] means a -> b
    from collections import deque, defaultdict
    adj = defaultdict(list); indeg = [0]*n
    for a, b in edges:
        adj[a].append(b); indeg[b] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    order = []
    while q:
        node = q.popleft(); order.append(node)
        for nxt in adj[node]:
            indeg[nxt] -= 1
            if indeg[nxt] == 0: q.append(nxt)
    return order if len(order) == n else []   # [] => cycle
```

## Union-Find (Disjoint Set) — fast connectivity
```python
class DSU:
    def __init__(self, n): self.p = list(range(n))
    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]      # path compression
            x = self.p[x]
        return x
    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False              # already connected (cycle)
        self.p[ra] = rb; return True
```

## Complexity
- BFS/DFS: **O(V + E)** (vertices + edges). Grid: O(rows·cols).
- Topological sort: O(V + E). Union-Find: ~O(1) amortized per op.
- Dijkstra (weighted, non-negative) with a heap: **O(E log V)**.

## Canonical problems (NeetCode)
| Problem | Tool |
|---|---|
| Number of Islands / Max Area of Island | grid DFS/BFS |
| Clone Graph | DFS/BFS + hashmap of copies |
| Course Schedule I / II | topological sort (cycle check / order) |
| Pacific Atlantic Water Flow | multi-source DFS from borders |
| Rotting Oranges | multi-source BFS (time = levels) |
| Number of Connected Components | union-find or DFS |
| Network Delay Time | Dijkstra (heap) |
| Word Ladder | BFS on word graph |

## Gotchas / re-solve notes
- **Never forget `seen`** — and for BFS, mark visited **when you enqueue**, not when
  you dequeue (else nodes get added multiple times).
- Recursion depth: deep/large graphs can blow the stack — use an **iterative** DFS
  (explicit [[stack]]) or BFS.
- BFS gives shortest path only when **edges are unweighted/equal**; weighted → Dijkstra.
- Grids: bounds-check before indexing; the 4 (or 8) directions are a fixed list.

## Related
- Grid problems overlap [[backtracking]] (Word Search) and matrix work in [[arrays-10-matrix]]
- Dijkstra uses a [[heap]]; BFS/DFS extend [[trees]] traversal to general graphs
